import { computed, isRef, reactive, ref, watch } from 'vue';
import type { FieldValidation, RulesObject, ValidationGroup, ValidatorFn, WrappedValidator } from './types';
import { LOCALE_KEYS } from '@/locales/types';
import { useI18n } from '@/locales/useI18n';

type AnyObject = Record<string, any>;

function getPath(obj: AnyObject, path: string) {
  if (!path) return obj;
  const parts = path.split('.');
  let cur: any = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function setPath(obj: AnyObject, path: string, value: any) {
  const parts = path.split('.');
  let cur: any = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur) || cur[p] == null) cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

/**
 * Build a "ref-like" object for path inside state (get/set)
 * Now supports both regular objects and refs
 */
function refFor(state: AnyObject | any, path: string) {
  return {
    get value() {
      // Якщо state - це ref, спочатку розгортаємо його
      const actualState = isRef(state) ? state.value : state;
      return getPath(actualState, path);
    },
    set value(v: any) {
      // Якщо state - це ref, спочатку розгортаємо його
      const actualState = isRef(state) ? state.value : state;
      setPath(actualState, path, v);
    },
  };
}

let uidCounter = 1;

function uid() {
  return `v_${Date.now()}_${uidCounter++}`;
}

/**
 * Create field validation node
 */
function createFieldNode(
  state: AnyObject | any,
  path: string,
  validators: ValidatorFn[],
  opts: {
    silentErrors?: boolean;
  }
) {
  const modelRef = refFor(state, path);
  const $dirty = ref(false);
  const $touched = ref(false);
  const $pending = ref(false);
  const lastValidateToken = { t: 0 };
  let isResetting = false;

  let externalResults: Array<{ $message: string; $validator?: string }> = [];
  const _errors = ref<Array<{ $message: string; $validator: string; $params?: any; $pending?: boolean }>>([]);

  async function runValidators(value: any) {
    const { t } = useI18n();

    const token = ++lastValidateToken.t;
    $pending.value = true;
    const errs: Array<{ $message: string; $validator: string; $params?: any; $pending?: boolean }> = [];

    for (const v of validators) {
      try {
        const wrapped = v as WrappedValidator;
        const res = wrapped.$async ? await v(value) : v(value);
        const out = await Promise.resolve(res);
        if (out === true) {
          // ok
        } else if (typeof out === 'string') {
          errs.push({
            $message: out,
            $validator: wrapped.$validatorName || wrapped.name || 'validator',
            $params: wrapped.$params,
          });
        } else if (out === false) {
          const message =
            typeof wrapped.$message === 'function'
              ? wrapped.$message(wrapped.$params)
              : wrapped.$message || t(LOCALE_KEYS.VALIDATION_ERROR);
          errs.push({
            $message: message as string,
            $validator: wrapped.$validatorName || wrapped.name || 'validator',
            $params: wrapped.$params,
          });
        }
      } catch (e: any) {
        const wrapped = v as WrappedValidator;
        errs.push({
          $message: e?.message || t(LOCALE_KEYS.VALIDATION_ERROR),
          $validator: wrapped.$validatorName || wrapped.name || 'validator',
        });
      }
    }

    if (externalResults.length) {
      for (const er of externalResults) {
        errs.push({ $message: er.$message, $validator: er.$validator || 'external' });
      }
    }

    if (token === lastValidateToken.t) {
      _errors.value = errs;
      $pending.value = false;
    }
  }

  // Спостерігаємо за змінами з підтримкою ref
  watch(
    () => {
      const actualState = isRef(state) ? state.value : state;
      return getPath(actualState, path);
    },
    () => {
      if (isResetting) return;
      $dirty.value = true;
      void runValidators(modelRef.value);
    }
  );

  const node: FieldValidation = reactive({
    get $model() {
      return modelRef.value;
    },
    set $model(val: any) {
      modelRef.value = val;
      $dirty.value = true;
      void node.$validate();
    },

    get $dirty() {
      return $dirty.value;
    },
    get $touched() {
      return $touched.value;
    },
    get $pending() {
      return $pending.value;
    },
    get $invalid() {
      return _errors.value && _errors.value.length > 0;
    },
    get $error() {
      return node.$dirty && node.$invalid;
    },
    get $errors() {
      return opts.silentErrors ? [] : _errors.value.map(e => ({ ...e }));
    },
    $params: validators.length ? (validators[0] as WrappedValidator).$params || {} : undefined,

    $touch() {
      $dirty.value = true;
      $touched.value = true;
    },

    $reset() {
      isResetting = true;
      $dirty.value = false;
      $touched.value = false;
      _errors.value = [];
      $pending.value = false;

      queueMicrotask(() => {
        isResetting = false;
      });
    },

    async $validate() {
      $dirty.value = true;
      await runValidators(modelRef.value);
      return !_errors.value.length;
    },
  });

  (node as any).$setExternalResults = (arr: Array<{ $message: string; $validator?: string }>) => {
    externalResults = arr || [];
    void node.$validate();
  };

  (node as any).$clearExternalResults = () => {
    externalResults = [];
    void node.$validate();
  };

  return node;
}

/**
 * Build validation tree recursively
 */
export function useValidate(
  rulesOrFactory: RulesObject | (() => RulesObject),
  state: AnyObject | any,
  globalOpts?: {
    silentErrors?: boolean;
  }
) {
  const opts = { silentErrors: !!globalOpts?.silentErrors };

  const rules = typeof rulesOrFactory === 'function' ? rulesOrFactory() : rulesOrFactory;

  // Розгортаємо ref якщо потрібно
  const actualState = isRef(state) ? state : state;

  function build(nodeRules: any, basePath = ''): any {
    const group: AnyObject = {};
    // For keeping track whether this group has fields (validators) or nested groups
    const keys = Object.keys(nodeRules || {});
    for (const key of keys) {
      const rule = nodeRules[key];
      const path = basePath ? `${basePath}.${key}` : key;

      if (typeof rule === 'function' || (Array.isArray(rule) && rule.length > 0 && typeof rule[0] === 'function')) {
        // Field validators - accept either single function or array of functions
        const validators: ValidatorFn[] = Array.isArray(rule) ? (rule as ValidatorFn[]) : [rule as ValidatorFn];
        group[key] = createFieldNode(actualState, path, validators, opts);
      } else if (typeof rule === 'object' && rule !== null) {
        // nested group or lazy factory
        if (typeof rule === 'object' && Array.isArray(rule) === false) {
          group[key] = build(rule as any, path);
        }
      } else {
        // fallback: treat as empty group
        group[key] = build({}, path);
      }
    }

    // group-level helpers
    const $validate = async () => {
      const res: boolean[] = [];
      for (const k of Object.keys(group)) {
        if (k.startsWith('$')) continue;
        const child = group[k];
        if (child && typeof child.$validate === 'function') {
          res.push(await child.$validate());
        }
      }
      return res.every(Boolean);
    };

    const $touch = () => {
      for (const k of Object.keys(group)) {
        if (k.startsWith('$')) continue;
        const child = group[k];
        if (child && typeof child.$touch === 'function') {
          child.$touch();
        }
      }
    };

    const $reset = () => {
      for (const k of Object.keys(group)) {
        if (k.startsWith('$')) continue;
        const child = group[k];
        if (child && typeof child.$reset === 'function') {
          child.$reset();
        }
      }
    };

    const $anyDirty = computed(() => {
      return Object.keys(group).some(k => {
        const child = group[k];
        return child && child.$dirty;
      });
    });

    const $anyInvalid = computed(() => {
      return Object.keys(group).some(k => {
        const child = group[k];
        return child && child.$invalid;
      });
    });

    const $anyError = computed(() => {
      return Object.keys(group).some(k => {
        const child = group[k];
        return child && child.$error;
      });
    });

    const $pending = computed(() => {
      return Object.keys(group).some(k => {
        const child = group[k];
        return child && child.$pending;
      });
    });

    // attach helpers to group
    const meta = {
      $validate,
      $touch,
      $reset,
      $anyDirty,
      $anyInvalid,
      $anyError,
      $pending,
      $silentErrors: opts.silentErrors,
      $externalResults: [] as any[],
      $addExternalResults(external: any) {
        // external can be array of { $property: 'a.b', $message } or {path: ['a','b'], $message}
        if (!external) return;
        // accept object mapping too
        if (Array.isArray(external)) {
          for (const r of external) {
            if (r.$property) {
              // apply to subnode
              const prop = r.$property;
              const node = getNodeByPath(resRoot, prop);
              if (node && (node as any).$setExternalResults) {
                (node as any).$setExternalResults([{ $message: r.$message, $validator: r.$validator }]);
              }
            } else if (r.path && Array.isArray(r.path)) {
              const prop = r.path.join('.');
              const node = getNodeByPath(resRoot, prop);
              if (node && (node as any).$setExternalResults) {
                (node as any).$setExternalResults([{ $message: r.$message, $validator: r.$validator }]);
              }
            }
          }
        } else if (typeof external === 'object') {
          // mapping { 'a.b': ['err1','err2'] }
          for (const k of Object.keys(external)) {
            const node = getNodeByPath(resRoot, k);
            if (node && (node as any).$setExternalResults) {
              const arr = Array.isArray(external[k])
                ? external[k].map((m: string) => ({ $message: m }))
                : [{ $message: external[k] }];
              (node as any).$setExternalResults(arr);
            }
          }
        }
      },
      $clearExternalResults() {
        // TODO: clear all
        traverseAndApply(resRoot, (n: any) => n.$clearExternalResults?.());
      },
    };

    Object.assign(group, meta);
    return group as ValidationGroup;
  }

  // helper to traverse the built result
  function traverseAndApply(root: any, fn: (node: any) => void) {
    if (!root || typeof root !== 'object') return;
    for (const k of Object.keys(root)) {
      if (k.startsWith('$')) continue;
      const child = root[k];
      if (child && typeof child === 'object') {
        if (typeof child.$validate === 'function' && typeof child.$model !== 'undefined') {
          fn(child);
        } else {
          traverseAndApply(child, fn);
        }
      }
    }
  }

  // helper to find node by dotted path
  function getNodeByPath(root: any, dotted: string) {
    const parts = dotted.split('.');
    let cur = root;
    for (const p of parts) {
      if (!cur) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  // build root
  const resRoot = build(rules, '');

  return resRoot as ValidationGroup;
}

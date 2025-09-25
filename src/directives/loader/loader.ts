import type { ObjectDirective, DirectiveBinding } from 'vue';

export const loaderDirective: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<any>) {
    const value = unwrap(binding.value);
    if (value) addLoader(el);
  },
  updated(el: HTMLElement, binding: DirectiveBinding<any>) {
    const value = unwrap(binding.value);
    const oldValue = unwrap(binding.oldValue);

    if (value !== oldValue) {
      if (value) addLoader(el);
      else removeLoader(el);
    }
  },
  unmounted(el: HTMLElement) {
    removeLoader(el);
  },
};

function unwrap(val: any): boolean {
  return typeof val === 'object' && val !== null && 'value' in val
    ? val.value
    : val;
}

function addLoader(el: HTMLElement) {
  if ((el as any)._loaderEl) return; // вже доданий

  const overlay = document.createElement('div');
  overlay.className = 'v-loader__overlay';
  overlay.innerHTML = `<span class="v-loader"></span>`;

  const currentPos = getComputedStyle(el).position;
  if (currentPos === 'static' || !currentPos) {
    el.style.position = 'relative';
  }

  el.appendChild(overlay);
  (el as any)._loaderEl = overlay;
}

function removeLoader(el: HTMLElement) {
  const overlay = (el as any)._loaderEl as HTMLElement | undefined;
  if (overlay) {
    overlay.remove();
    delete (el as any)._loaderEl;
  }
}

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import type { VtInputEmits, VtInputMethods, VtInputProps } from './types';
  import VIcon from '@/components/icon/VIcon.vue';

  // Пропси з дефолтними значеннями
  const props = withDefaults(defineProps<VtInputProps>(), {
    type: 'text',
    size: 'medium',
    status: 'default',
    disabled: false,
    clearable: false,
    showPassword: false,
    rows: 3,
    resize: 'vertical',
    autosize: false,
    validateOnInput: true,
    validateOnBlur: true,
  });

  // Емітери
  const emit = defineEmits<VtInputEmits>();

  // Реактивні змінні
  const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>();
  const textareaRef = ref<HTMLTextAreaElement>();
  const isFocused = ref(false);
  const isPasswordVisible = ref(false);
  const textareaHeight = ref<string>();
  const validationErrors = ref<string[]>([]);
  const isValid = ref(true);
  const isResizing = ref(false);

  // Валідаційні функції
  const validators = {
    email: (value: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },

    url: (value: string): boolean => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },

    number: (value: string): boolean => {
      return !isNaN(Number(value)) && isFinite(Number(value));
    },

    required: (value: string | number): boolean => {
      return value !== '' && value !== null && value !== undefined;
    },

    minlength: (value: string, min: number): boolean => {
      return String(value).length >= min;
    },

    maxlength: (value: string, max: number): boolean => {
      return String(value).length <= max;
    },

    min: (value: string, min: number): boolean => {
      const num = Number(value);
      return !isNaN(num) && num >= min;
    },

    max: (value: string, max: number): boolean => {
      const num = Number(value);
      return !isNaN(num) && num <= max;
    },

    pattern: (value: string, pattern: string): boolean => {
      const regex = new RegExp(pattern);
      return regex.test(value);
    },

    custom: (value: string | number, validator: (val: string | number) => boolean): boolean => {
      return validator(value);
    },
  };

  // Валідація значення
  const validateValue = (value: string | number): void => {
    const errors: string[] = [];
    const stringValue = String(value || '');

    // Перевірка required
    if (props.required && !validators.required(value)) {
      errors.push(props.requiredMessage || "Це поле є обов'язковим");
    }

    // Якщо значення порожнє і не required, пропускаємо інші валідації
    if (!stringValue && !props.required) {
      validationErrors.value = errors;
      isValid.value = errors.length === 0;
      return;
    }

    // Валідація за типом
    switch (props.type) {
      case 'email':
        if (stringValue && !validators.email(stringValue)) {
          errors.push(props.emailMessage || 'Введіть коректну email адресу');
        }
        break;

      case 'url':
        if (stringValue && !validators.url(stringValue)) {
          errors.push(props.urlMessage || 'Введіть коректний URL');
        }
        break;

      case 'number':
        if (stringValue && !validators.number(stringValue)) {
          errors.push(props.numberMessage || 'Введіть коректне число');
        }
        break;
    }

    // Валідація довжини
    if (props.minlength && stringValue && !validators.minlength(stringValue, props.minlength)) {
      errors.push(props.minlengthMessage || `Мінімальна довжина: ${props.minlength} символів`);
    }

    if (props.maxlength && stringValue && !validators.maxlength(stringValue, props.maxlength)) {
      errors.push(props.maxlengthMessage || `Максимальна довжина: ${props.maxlength} символів`);
    }

    // Валідація діапазону для чисел
    if (props.type === 'number' && stringValue && validators.number(stringValue)) {
      if (props.min !== undefined && !validators.min(stringValue, props.min)) {
        errors.push(props.minMessage || `Мінімальне значення: ${props.min}`);
      }

      if (props.max !== undefined && !validators.max(stringValue, props.max)) {
        errors.push(props.maxMessage || `Максимальне значення: ${props.max}`);
      }
    }

    // Валідація за патерном
    if (props.pattern && stringValue && !validators.pattern(stringValue, props.pattern)) {
      errors.push(props.patternMessage || 'Значення не відповідає вимогам формату');
    }

    // Кастомна валідація
    if (props.customValidator && !validators.custom(value, props.customValidator)) {
      errors.push(props.customValidatorMessage || 'Значення не проходить валідацію');
    }

    validationErrors.value = errors;
    isValid.value = errors.length === 0;

    // Емітимо результат валідації
    emit('validation', { isValid: isValid.value, errors: errors });
  };

  // Обчислювані властивості
  const isTextarea = computed(() => props.type === 'textarea');

  // Автоматичні іконки для типів полів
  const getAutomaticPrefixIcon = computed(() => {
    // Для password полів не додаємо автоматичні іконки
    if (props.type === 'password') return null;

    switch (props.type) {
      case 'email':
        return 'email';
      case 'url':
        return 'url';
      default:
        return null;
    }
  });

  // Дефолтні іконки для станів
  const getDefaultStatusIcon = computed(() => {
    // Якщо передана користувацька prefix іконка, не показуємо дефолтні
    if (props.prefixIcon) return null;

    // Показуємо дефолтні іконки тільки якщо немає автоматичних іконок типу
    if (getAutomaticPrefixIcon.value) return null;

    // У випадку якщо є errorMessage відображаємо іконку типу error
    if (props.errorMessage) return 'alertCircle';

    // Показуємо іконки для всіх станів, включаючи явно встановлені
    switch (props.status) {
      case 'error':
        return 'alertCircle';
      case 'warning':
        return 'alertTriangle';
      case 'success':
        return 'checkCircle';
      default:
        // Для дефолтного стану показуємо іконку тільки при помилці валідації
        if (!isValid.value) {
          return 'alertCircle';
        }
        return null;
    }
  });

  // Визначаємо чи є prefix іконка (користувацька, автоматична або стану)
  const hasPrefix = computed(() => {
    return !!props.prefixIcon || !!getAutomaticPrefixIcon.value || !!getDefaultStatusIcon.value;
  });

  // Визначаємо фінальну prefix іконку
  const finalPrefixIcon = computed(() => {
    return props.prefixIcon || getAutomaticPrefixIcon.value || getDefaultStatusIcon.value;
  });

  // Клас для prefix іконки залежно від стану
  const prefixIconClass = computed(() => {
    const baseClass = 'vt-input__icon';

    // Визначаємо стан для підсвічування іконки
    const iconStatus = props.status !== 'default' ? props.status : isValid.value ? 'default' : 'error';

    // Якщо передана користувацька іконка, підсвічуємо її кольором стану
    if (props.prefixIcon) {
      return baseClass;
    }

    // Для дефолтних іконок стану
    if (getDefaultStatusIcon.value) {
      switch (iconStatus) {
        case 'error':
          return `${baseClass} vt-input__icon--error`;
        case 'warning':
          return `${baseClass} vt-input__icon--warning`;
        case 'success':
          return `${baseClass} vt-input__icon--success`;
        default:
          return baseClass;
      }
    }

    return baseClass;
  });

  // Для suffix іконок забороняємо додавати користувацькі для email/url та password
  const hasSuffix = computed(() => {
    // Для email, url та password не дозволяємо suffix іконки
    if (['email', 'url', 'password'].includes(props.type) && props.suffixIcon) {
      return props.clearable || props.showPassword;
    }
    return !!props.suffixIcon || props.clearable || props.showPassword;
  });

  // Фінальна suffix іконка (тільки якщо дозволено)
  const finalSuffixIcon = computed(() => {
    // Для email, url та password не показуємо користувацькі suffix іконки
    if (['email', 'url', 'password'].includes(props.type)) {
      return null;
    }
    return props.suffixIcon;
  });

  const showClearButton = computed(
    () => props.clearable && !props.disabled && props.modelValue && String(props.modelValue).length > 0
  );

  const currentStatus = computed(() => {
    if (props.status !== 'default') return props.status;
    if (props.errorMessage) return 'error';
    if (!isValid.value) return 'error';
    return 'default';
  });

  const inputClasses = computed(() => [
    'vt-input',
    props.size ? `vt-input--${props.size}` : 'vt-input--medium',
    `vt-input--${currentStatus.value}`,
    {
      'vt-input--disabled': props.disabled,
      'vt-input--focused': isFocused.value,
      'vt-input--textarea': isTextarea.value,
      'vt-input--has-prefix': hasPrefix.value,
      'vt-input--has-suffix': hasSuffix.value,
      'vt-input--invalid': !!props.errorMessage || !isValid.value,
    },
  ]);

  const currentInputType = computed(() => {
    if (props.type === 'password') {
      return isPasswordVisible.value ? 'text' : 'password';
    }
    return props.type === 'textarea' ? 'text' : props.type;
  });

  const displayErrorMessage = computed(() => {
    if (props.errorMessage) return props.errorMessage;
    if (validationErrors.value.length > 0) return validationErrors.value[0];
    return '';
  });

  // Визначаємо стиль resize для textarea
  const textareaResize = computed(() => {
    // Якщо autosize включений і є maxRows, відключаємо ручний resize
    if (props.autosize && typeof props.autosize === 'object' && props.autosize.maxRows) {
      return 'none';
    }
    // Якщо autosize включений але немає maxRows, дозволяємо ручний resize
    return props.resize;
  });

  // Методи
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    let value: string | number = target.value;

    // Конвертація для number типу
    if (props.type === 'number' && value !== '') {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        value = numValue;
      }
    }

    emit('update:modelValue', value);
    emit('input', event);

    // Валідація при введенні
    if (props.validateOnInput) {
      validateValue(value);
    }

    // Автоматичне підлаштування висоти тільки при введенні тексту
    if (isTextarea.value && props.autosize && !isResizing.value) {
      nextTick(() => calculateTextareaHeight());
    }
  };

  const handleChange = (event: Event) => {
    emit('change', event);

    // Валідація при зміні
    if (!props.validateOnInput) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      validateValue(target.value);
    }
  };

  const handleFocus = (event: FocusEvent) => {
    isFocused.value = true;
    emit('focus', event);
  };

  const handleBlur = (event: FocusEvent) => {
    isFocused.value = false;
    emit('blur', event);

    // Валідація при втраті фокусу
    if (props.validateOnBlur) {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      validateValue(target.value);
    }
  };

  const handleClear = () => {
    emit('update:modelValue', '');
    emit('clear');
    inputRef.value?.focus();

    // Очистка помилок валідації
    validationErrors.value = [];
    isValid.value = true;
    emit('validation', { isValid: true, errors: [] });
  };

  const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
    nextTick(() => {
      inputRef.value?.focus();
    });
  };

  const calculateTextareaHeight = () => {
    if (!textareaRef.value || !props.autosize || isResizing.value) return;

    const textarea = textareaRef.value;

    // Зберігаємо поточну висоту
    const currentHeight = textarea.style.height;

    // Тимчасово скидаємо висоту для точного вимірювання
    textarea.style.height = 'auto';

    let height = textarea.scrollHeight;

    if (typeof props.autosize === 'object') {
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = props.autosize.minRows ? props.autosize.minRows * lineHeight : 0;
      const maxHeight = props.autosize.maxRows ? props.autosize.maxRows * lineHeight : Infinity;

      height = Math.max(minHeight, Math.min(height, maxHeight));
    }

    const newHeight = `${height}px`;

    // Встановлюємо нову висоту тільки якщо вона відрізняється
    if (newHeight !== currentHeight) {
      textareaHeight.value = newHeight;
      textarea.style.height = newHeight;
    }
  };

  // Додаємо обробники для відстеження ручного ресайзу
  const handleMouseDown = (event: MouseEvent) => {
    if (!textareaRef.value) return;

    // Перевіряємо, чи дозволений ручний resize
    const isResizeAllowed = textareaResize.value !== 'none';
    if (!isResizeAllowed) return;

    const textarea = textareaRef.value;
    const rect = textarea.getBoundingClientRect();

    // Перевіряємо, чи клік відбувся в правому нижньому куті (зона ресайзу)
    const isResizeHandle = event.clientX > rect.right - 20 && event.clientY > rect.bottom - 20;

    if (isResizeHandle) {
      isResizing.value = true;

      const handleMouseUp = () => {
        isResizing.value = false;
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  // Методи для експорту (ref methods)
  const focus = () => {
    inputRef.value?.focus();
  };

  const blur = () => {
    inputRef.value?.blur();
  };

  const select = () => {
    inputRef.value?.select();
  };

  const clear = () => {
    handleClear();
  };

  const validate = () => {
    validateValue(props.modelValue || '');
    return isValid.value;
  };

  const clearValidation = () => {
    validationErrors.value = [];
    isValid.value = true;
    emit('validation', { isValid: true, errors: [] });
  };

  const getInputElement = () => {
    return inputRef.value || null;
  };

  const getValidationState = () => {
    return {
      isValid: isValid.value,
      errors: [...validationErrors.value],
    };
  };

  // Експорт методів через defineExpose
  defineExpose<VtInputMethods>({
    focus,
    blur,
    select,
    clear,
    validate,
    clearValidation,
    getInputElement,
    getValidationState,
  });

  // Watchers
  watch(
    () => props.modelValue,
    newValue => {
      if (isTextarea.value && props.autosize && !isResizing.value) {
        nextTick(calculateTextareaHeight);
      }

      // Валідація при зміні modelValue ззовні
      if (props.validateOnInput) {
        validateValue(newValue || '');
      }
    }
  );

  // Початкова валідація
  watch(
    () => [props.required, props.minlength, props.maxlength, props.min, props.max, props.pattern],
    () => {
      if (props.modelValue !== undefined && props.modelValue !== '') {
        validateValue(props.modelValue);
      }
    },
    { immediate: true }
  );

  // Lifecycle
  onMounted(() => {
    if (isTextarea.value && props.autosize) {
      calculateTextareaHeight();
    }

    // Початкова валідація якщо є значення
    if (props.modelValue !== undefined && props.modelValue !== '') {
      validateValue(props.modelValue);
    }
  });

  // Resize observer тільки для autosize без можливості ручного ресайзу
  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    // ResizeObserver використовуємо тільки якщо autosize включений
    // і ручний resize відключений
    if (isTextarea.value && props.autosize) {
      // Не використовуємо ResizeObserver, щоб уникнути конфліктів
      // Замість цього покладаємося на обробники подій
    }
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });
</script>

<template>
  <div :class="inputClasses">
    <!-- Label -->
    <label v-if="label" class="vt-input__label" :for="id">
      {{ label }}
      <span v-if="required" class="vt-input__required">*</span>
    </label>

    <!-- Input Container -->
    <div class="vt-input__container">
      <!-- Prefix Icon -->
      <div v-if="hasPrefix" class="vt-input__prefix">
        <VIcon :name="finalPrefixIcon!" :class="prefixIconClass" />
      </div>

      <!-- Input Element -->
      <textarea
        v-if="isTextarea"
        ref="textareaRef"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        :cols="cols"
        :maxlength="maxlength"
        :minlength="minlength"
        :required="required"
        :name="name"
        :id="id"
        :tabindex="tabindex"
        :autocomplete="autocomplete"
        :style="{ resize: textareaResize, height: textareaHeight }"
        class="vt-input__field vt-input__textarea"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @mousedown="handleMouseDown"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
        @keypress="$emit('keypress', $event)"
        @click="$emit('click', $event)"
      />

      <input
        v-else
        ref="inputRef"
        :type="currentInputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        :required="required"
        :pattern="pattern"
        :name="name"
        :id="id"
        :tabindex="tabindex"
        :autocomplete="autocomplete"
        class="vt-input__field"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="$emit('keydown', $event)"
        @keyup="$emit('keyup', $event)"
        @keypress="$emit('keypress', $event)"
        @click="$emit('click', $event)"
      />

      <!-- Suffix Icons -->
      <div v-if="hasSuffix" class="vt-input__suffix">
        <!-- Clear Button -->
        <button v-if="showClearButton" type="button" class="vt-input__clear-btn" @click="handleClear">
          <VIcon name="close" class="vt-input__icon" />
        </button>

        <!-- Password Toggle -->
        <button
          v-if="showPassword && type === 'password'"
          type="button"
          class="vt-input__password-btn"
          @click="togglePasswordVisibility"
        >
          <VIcon :name="isPasswordVisible ? 'eyeOpened' : 'eyeClosed'" class="vt-input__icon" />
        </button>

        <!-- Suffix Icon -->
        <VIcon v-if="finalSuffixIcon" :name="finalSuffixIcon" class="vt-input__icon" />
      </div>
    </div>

    <!-- Helper Text / Error Message -->
    <div v-if="helperText || displayErrorMessage" class="vt-input__help">
      <span v-if="displayErrorMessage" class="vt-input__error">
        {{ displayErrorMessage }}
      </span>
      <span v-else-if="helperText" class="vt-input__helper">
        {{ helperText }}
      </span>
    </div>

    <!-- Multiple Validation Errors -->
    <div v-if="validationErrors.length > 1 && showAllErrors" class="vt-input__errors">
      <div v-for="(error, index) in validationErrors" :key="index" class="vt-input__error-item">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

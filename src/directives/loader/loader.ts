import type { DirectiveBinding, ObjectDirective } from 'vue';

const loaderTemplate = `
  <div class="vt-loader-base__overlay">
    <span class="vt-loader-base"></span>
  </div>
`;

export const loaderDirective: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    if (binding.value) {
      addLoader(el);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    const value = unwrap(binding.value);
    const oldValue = unwrap(binding.oldValue);

    if (value !== oldValue) {
      if (value) {
        addLoader(el);
      } else {
        removeLoader(el);
      }
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
  if (el.querySelector('.vt-loader__overlay')) return;

  const currentPos = getComputedStyle(el).position;
  if (currentPos === 'static' || !currentPos) {
    el.style.position = 'relative';
  }

  el.insertAdjacentHTML('beforeend', loaderTemplate);
}

function removeLoader(el: HTMLElement) {
  const loader = el.querySelector('.vt-loader__overlay');
  if (loader) loader.remove();
}

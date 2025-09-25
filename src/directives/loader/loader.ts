import type { DirectiveBinding, ObjectDirective } from 'vue';
import '@/styles/loader.scss';

const loaderTemplate = `
  <div class="vt-loader__overlay">
    <span class="vt-loader"></span>
  </div>
`;

export const loaderDirective: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    if (binding.value) {
      addLoader(el);
    }
  },
  updated(el: HTMLElement, binding: DirectiveBinding<boolean>) {
    if (binding.value !== binding.oldValue) {
      if (binding.value) {
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

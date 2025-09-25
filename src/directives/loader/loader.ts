import type { ObjectDirective, DirectiveBinding } from 'vue';
import { unref } from 'vue';

export const loaderDirective: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding<any>) {
    const value = unref(binding.value);
    if (value) addLoader(el);
  },
  updated(el: HTMLElement, binding: DirectiveBinding<any>) {
    const value = unref(binding.value);
    const oldValue = unref(binding.oldValue);

    if (value !== oldValue) {
      if (value) addLoader(el);
      else removeLoader(el);
    }
  },
  unmounted(el: HTMLElement) {
    removeLoader(el);
  },
};

function addLoader(el: HTMLElement) {
  if ((el as any)._loaderEl) return; // вже доданий

  const overlay = document.createElement('div');
  overlay.className = 'vt-loader-base__overlay';
  overlay.innerHTML = `<span class="vt-base-loader"></span>`;

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
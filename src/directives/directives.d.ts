import type { Directive } from 'vue';

declare module 'vue' {
  export interface ComponentCustomDirectives {
    vLoader: Directive;
    vTooltip: Directive;
  }
}
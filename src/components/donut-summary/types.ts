import type { IconName } from '@/components/icon/icons';
import type { ChartSegment } from '@/components/charts/types';

/** Рядок легенди */
export interface VDonutSummaryItem {
  label: string;
  /** Кількість: для відсотка і сегмента діаграми */
  count: number;
  /** Колір крапки і сегмента діаграми. Без кольору — рядок без маркера і не потрапляє в діаграму */
  color?: string;
  /** Іконка замість крапки (фарбується в `color`) */
  icon?: IconName;
  /** Що показати замість `count` (напр. середня оцінка "4.25") */
  value?: string | number;
  /** Глибина в дереві: 1 — «↳» під попереднім рядком, 2 — під ним ще глибше */
  level?: 0 | 1 | 2;
  /**
   * Сусідні рядки з однаковою групою — блок з відступом під батьківським рядком.
   * У низькому широкому віджеті рядки групи стають в один рядок.
   */
  group?: string;
  /** false — не показувати відсоток */
  percent?: boolean;
  /** Від чого рахувати відсоток рядка (за замовчуванням — `total`) */
  percentBase?: number;
  /** Чи малювати сегмент у діаграмі. За замовчуванням — якщо є `color` */
  chart?: boolean;
}

/**
 * Розкладка:
 * - `row` — діаграма зліва, легенда справа;
 * - `column` — легенда під діаграмою (вузький віджет);
 * - `compact` — маленька діаграма, групи легенди в один рядок (низький широкий віджет).
 */
export type VDonutSummaryLayout = 'row' | 'column' | 'compact';

export interface VDonutSummaryProps {
  /** Підпис підсумку («Всі вхідні дзвінки») */
  title: string;
  /** Підсумок; від нього рахуються відсотки */
  total: number;
  items: VDonutSummaryItem[];
  /** Сегменти діаграми, якщо відрізняються від рядків легенди */
  segments?: ChartSegment[];
  /** Мінімальний діаметр діаграми, px */
  minSize?: number;
  /** Максимальний діаметр діаграми, px */
  maxSize?: number;
  /** Зафіксувати розкладку замість автоматичної */
  layout?: VDonutSummaryLayout;
}

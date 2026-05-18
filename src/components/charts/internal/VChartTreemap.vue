<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import type { TreemapNode } from '../types';
  import { useI18n } from '@/locales/useI18n';
  import { LOCALE_KEYS } from '@/locales/types';
  import VIcon from '@/components/icon/VIcon.vue';

  const props = defineProps<{
    nodes: TreemapNode[];
    format?: (v: number) => string;
    height?: number;
  }>();

  const { t } = useI18n();
  const wrapper = ref<HTMLDivElement | null>(null);
  const containerWidth = ref(600);
  const containerHeight = computed(() => props.height ?? 260);
  const hoveredId = ref<string | null>(null);

  // ── Squarified treemap algorithm ──────────────────────────────────────────────
  interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  interface LayoutNode extends TreemapNode {
    rect: Rect;
  }

  function squarify(nodes: TreemapNode[], rect: Rect): LayoutNode[] {
    if (!nodes.length) return [];
    const total = nodes.reduce((s, n) => s + n.value, 0);
    if (!total) return [];

    const area = rect.w * rect.h;
    const result: LayoutNode[] = [];
    let remaining = [...nodes];
    let cur = { ...rect };

    while (remaining.length > 0) {
      const row: TreemapNode[] = [];
      let rowSum = 0;
      const isHoriz = cur.w >= cur.h;
      const side = isHoriz ? cur.h : cur.w;
      const scaledTotal = remaining.reduce((s, n) => s + n.value, 0);

      for (const node of remaining) {
        row.push(node);
        rowSum += node.value;
        const rowArea = (rowSum / scaledTotal) * cur.w * cur.h;
        const rowSide = rowArea / side;
        const worst = Math.max(
          ...row.map(n => {
            const a = (n.value / rowSum) * rowArea;
            const short = Math.min(rowSide, a / rowSide);
            const long = Math.max(rowSide, a / rowSide);
            return long / short;
          })
        );

        if (row.length > 1 && worst > 2) {
          row.pop();
          rowSum -= node.value;
          break;
        }
      }

      // Lay out the finalized row
      const rowAreaFrac = rowSum / scaledTotal;
      const rowThick = isHoriz ? cur.w * rowAreaFrac : cur.h * rowAreaFrac;
      let offset = 0;
      for (const node of row) {
        const frac = node.value / rowSum;
        const len = (isHoriz ? cur.h : cur.w) * frac;
        result.push({
          ...node,
          rect: isHoriz
            ? { x: cur.x, y: cur.y + offset, w: rowThick, h: len }
            : { x: cur.x + offset, y: cur.y, w: len, h: rowThick },
        });
        offset += len;
      }

      remaining = remaining.filter(n => !row.includes(n));
      if (isHoriz) {
        cur = { x: cur.x + rowThick, y: cur.y, w: cur.w - rowThick, h: cur.h };
      } else {
        cur = { x: cur.x, y: cur.y + rowThick, w: cur.w, h: cur.h - rowThick };
      }
    }

    return result;
  }

  // ── Sort descending for squarify quality ──────────────────────────────────────
  const sorted = computed(() => [...props.nodes].sort((a, b) => b.value - a.value));

  const layout = computed<LayoutNode[]>(() => {
    const W = containerWidth.value;
    const H = containerHeight.value;
    if (!W || !H) return [];
    return squarify(sorted.value, { x: 0, y: 0, w: W, h: H });
  });

  // ── Helpers ───────────────────────────────────────────────────────────────────
  function fmt(v: number) {
    return props.format ? props.format(v) : v.toString();
  }

  function lighten(hex: string, amount = 40): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  function labelFits(rect: Rect, minW = 60, minH = 30) {
    return rect.w >= minW && rect.h >= minH;
  }

  // ── Resize observer ───────────────────────────────────────────────────────────
  let ro: ResizeObserver | null = null;
  onMounted(() => {
    if (wrapper.value) {
      ro = new ResizeObserver(entries => {
        containerWidth.value = entries[0].contentRect.width;
      });
      ro.observe(wrapper.value);
      containerWidth.value = wrapper.value.clientWidth || 600;
    }
  });
  onUnmounted(() => ro?.disconnect());
</script>

<template>
  <div ref="wrapper" :style="{ height: containerHeight + 'px' }" class="vt-chart__treemap-wrapper">
    <div v-if="!layout.length" class="vt-chart__treemap-wrapper--empty">
      <div class="vt-chart__treemap-empty">
        <VIcon name="empty" />
        <span>{{ t(LOCALE_KEYS.TABLE_EMPTY) }}</span>
      </div>
    </div>
    <svg
      v-else
      :viewBox="`0 0 ${containerWidth} ${containerHeight}`"
      :width="containerWidth"
      :height="containerHeight"
      class="vt-chart__treemap-svg"
    >
      <g v-for="node in layout" :key="node.id">
        <rect
          :x="node.rect.x + 1"
          :y="node.rect.y + 1"
          :width="Math.max(node.rect.w - 2, 0)"
          :height="Math.max(node.rect.h - 2, 0)"
          :fill="hoveredId === node.id ? lighten(node.color) : node.color"
          :rx="4"
          class="vt-chart__treemap-cell"
          @mouseenter="hoveredId = node.id"
          @mouseleave="hoveredId = null"
        />

        <!-- Label when tile is big enough -->
        <template v-if="labelFits(node.rect)">
          <text
            :x="node.rect.x + node.rect.w / 2"
            :y="node.rect.y + node.rect.h / 2 - (node.rect.h > 50 ? 8 : 0)"
            class="vt-chart__treemap-label"
            dominant-baseline="middle"
            text-anchor="middle"
          >
            {{ node.label }}
          </text>
          <text
            v-if="node.rect.h > 44"
            :x="node.rect.x + node.rect.w / 2"
            :y="node.rect.y + node.rect.h / 2 + 12"
            class="vt-chart__treemap-value"
            dominant-baseline="middle"
            text-anchor="middle"
          >
            {{ fmt(node.value) }}
          </text>
        </template>

        <!-- Tooltip on hover (tiny tiles) -->
        <title>{{ node.label }}: {{ fmt(node.value) }}</title>
      </g>
    </svg>
  </div>
</template>

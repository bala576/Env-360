import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { CUSTOMIZE_ICONS, PreviewItem, WIDGET_PREVIEWS, WidgetPreview as Preview } from '../customizedashboard.data';

interface ChartLine {
  label: string;
  color: string;
  path: string;
}

interface DonutSegment {
  color: string;
  dash: string;
  offset: number;
}

// Line chart plot area inside its 320x130 viewBox
const CHART = { left: 24, right: 314, top: 8, bottom: 108 };

const LINES: Record<string, ChartLine[]> = {};
const TICKS: Record<string, { y: number; label: number }[]> = {};
const DONUTS: Record<string, DonutSegment[]> = {};

// Chart geometry depends only on the static preview data, so build it once for all instances
for (const [id, preview] of Object.entries(WIDGET_PREVIEWS)) {
  if (preview.kind === 'line') {
    const { min, max } = preview;
    const y = (v: number) => CHART.bottom - ((v - min) / (max - min)) * (CHART.bottom - CHART.top);
    LINES[id] = preview.series.map((s) => {
      const step = (CHART.right - CHART.left) / (s.data.length - 1);
      const path = s.data.map((v, i) => `${i ? 'L' : 'M'}${(CHART.left + i * step).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
      return { label: s.label, color: s.color, path };
    });
    TICKS[id] = [0, 1, 2, 3].map((n) => {
      const label = Math.round(min + ((max - min) * n) / 3);
      return { y: y(label), label };
    });
  } else if (preview.kind === 'donut') {
    const total = preview.items.reduce((sum, i) => sum + i.value, 0);
    let acc = 0;
    DONUTS[id] = preview.items.map((i) => {
      const pct = (i.value / total) * 100;
      const segment = { color: i.color, dash: `${pct} ${100 - pct}`, offset: 25 - acc };
      acc += pct;
      return segment;
    });
  }
}

@Component({
  selector: 'app-widget-preview',
  imports: [CommonModule],
  templateUrl: './widget-preview.html',
  styleUrl: './widget-preview.css',
})
export class WidgetPreview {
  @Input() widgetId = '';
  @HostBinding('class.compact') @Input() compact = false;

  readonly icons = CUSTOMIZE_ICONS;

  get preview(): Preview | undefined {
    return WIDGET_PREVIEWS[this.widgetId];
  }

  get lines(): ChartLine[] {
    return LINES[this.widgetId] ?? [];
  }

  get ticks(): { y: number; label: number }[] {
    return TICKS[this.widgetId] ?? [];
  }

  get donut(): DonutSegment[] {
    return DONUTS[this.widgetId] ?? [];
  }

  barSize(item: PreviewItem, items: PreviewItem[]): number {
    return (item.value / Math.max(...items.map((i) => i.value))) * 100;
  }
}

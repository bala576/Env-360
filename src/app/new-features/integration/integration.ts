import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import {
  BENEFITS,
  DATA_INPUTS,
  DATA_OUTPUTS,
  DEPLOYMENTS,
  INT_ICONS,
  INT_TABS,
  METHODS,
  PRODUCTS,
  SAMPLE_LAYER,
  SAMPLE_SOURCES,
  SAMPLE_TARGETS,
  SOURCES,
} from './integration.data';

interface Connector {
  key: string;
  d: string;
  // Arrow direction: into the platform, or out of it
  out?: boolean;
}

// Spread n points across [from, to], keeping them off the very ends
function spread(i: number, n: number, from: number, to: number): number {
  return n <= 1 ? (from + to) / 2 : from + ((to - from) * i) / (n - 1);
}

@Component({
  selector: 'app-integration',
  imports: [CommonModule],
  templateUrl: './integration.html',
  styleUrl: './integration.css',
})
export class Integration implements OnDestroy {

  icons = INT_ICONS;
  tabs = INT_TABS;
  activeTab = INT_TABS[0];
  sources = SOURCES;
  inputs = DATA_INPUTS;
  outputs = DATA_OUTPUTS;
  products = PRODUCTS;
  deployments = DEPLOYMENTS;
  methods = METHODS;
  benefits = BENEFITS;
  sampleSources = SAMPLE_SOURCES;
  sampleLayer = SAMPLE_LAYER;
  sampleTargets = SAMPLE_TARGETS;

  deployment = DEPLOYMENTS[0].key;
  // Connector under the pointer (a source, input, output or the deployment strip)
  hoverKey: string | null = null;

  // ---------- Connector lines ----------
  // Lines are drawn in pixel space over the flow area, from the measured
  // positions of the cards they join, so they follow any layout change.
  connectors: Connector[] = [];
  size = { width: 0, height: 0 };

  private zone = inject(NgZone);
  private resizer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(() => this.scheduleMeasure());
  private frame = 0;
  private flowEl?: HTMLElement;

  // The flow area is recreated when returning to the Overview tab, so observe each new one
  @ViewChild('flow') set flow(el: ElementRef<HTMLElement> | undefined) {
    if (this.flowEl) this.resizer?.unobserve(this.flowEl);
    this.flowEl = el?.nativeElement;
    if (this.flowEl) {
      this.resizer?.observe(this.flowEl);
      this.scheduleMeasure();
    }
  }

  @ViewChild('cloud') cloud?: ElementRef<HTMLElement>;

  ngOnDestroy(): void {
    this.resizer?.disconnect();
    cancelAnimationFrame(this.frame);
  }

  // Cards slide in on load; measure again once each animation settles
  @HostListener('animationend')
  onAnimationEnd(): void {
    this.scheduleMeasure();
  }

  private scheduleMeasure(): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.zone.run(() => this.measure()));
  }

  private measure(): void {
    const host = this.flowEl;
    const cloudEl = this.cloud?.nativeElement;
    if (!host || !cloudEl) return;
    const origin = host.getBoundingClientRect();
    const rect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { left: r.left - origin.left, top: r.top - origin.top, right: r.right - origin.left, bottom: r.bottom - origin.top, width: r.width, height: r.height };
    };
    const all = (attr: string) => Array.from(host.querySelectorAll<HTMLElement>(`[${attr}]`)).map(el => ({ key: el.getAttribute(attr)!, ...rect(el) }));

    const c = rect(cloudEl);
    const midY = c.top + c.height * 0.55;
    const lines: Connector[] = [];

    // Source systems drop into the top of the cloud. When the cards wrap onto
    // several rows only the bottom row is wired, so no line crosses a card.
    const allSrcs = all('data-src');
    const lowest = Math.max(...allSrcs.map(s => s.bottom));
    const srcs = allSrcs.filter(s => s.bottom >= lowest - 4);
    srcs.forEach((s, i) => {
      const sx = s.left + s.width / 2;
      const tx = spread(i, srcs.length, c.left + c.width * 0.22, c.right - c.width * 0.22);
      const ty = c.top + c.height * 0.12;
      const my = (s.bottom + ty) / 2;
      lines.push({ key: s.key, d: `M${sx},${s.bottom} C${sx},${my} ${tx},${my} ${tx},${ty}` });
    });

    // Data inputs converge on the cloud's left side
    const ins = all('data-in');
    ins.forEach((s, i) => {
      const sy = s.top + s.height / 2;
      const tx = c.left + c.width * 0.07;
      const ty = spread(i, ins.length, midY - 34, midY + 34);
      const mx = (s.right + tx) / 2;
      lines.push({ key: s.key, d: `M${s.right},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}` });
    });

    // Outputs fan out from the right side
    const outs = all('data-out');
    outs.forEach((s, i) => {
      const sy = s.top + s.height / 2;
      const fx = c.right - c.width * 0.07;
      const fy = spread(i, outs.length, midY - 34, midY + 34);
      const mx = (fx + s.left) / 2;
      lines.push({ key: s.key, d: `M${fx},${fy} C${mx},${fy} ${mx},${sy} ${s.left},${sy}`, out: true });
    });

    // Deployment options sit under the cloud
    const dep = host.querySelector('[data-deploy]');
    if (dep) {
      const d = rect(dep);
      const x = c.left + c.width / 2;
      lines.push({ key: 'deploy', d: `M${x},${d.top} L${x},${c.bottom - c.height * 0.06}` });
    }

    this.connectors = lines;
    this.size = { width: origin.width, height: origin.height };
  }

  isLit(key: string): boolean {
    return this.hoverKey === key;
  }
}

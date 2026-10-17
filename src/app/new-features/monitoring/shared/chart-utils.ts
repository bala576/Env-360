// Shared helpers for the simulated monitoring charts (Trend Analysis, Multi-Parameter).
import { DropdownOption } from '../../../shared/dropdown/dropdown';

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
// Base sampling slot of the simulated sensors
export const SLOT = 5 * MINUTE;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface Axis {
  min: number;
  max: number;
  ticks: number[];
}

// Deterministic pseudo-random number in [0, 1)
export function hash(a: number, b: number): number {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toInputDate(t: number): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseInputDate(value: string): number {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

export function shortDate(t: number): string {
  const d = new Date(t);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]}`;
}

export function clock(t: number): string {
  const d = new Date(t);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fullDate(t: number): string {
  return `${shortDate(t)} ${new Date(t).getFullYear()}`;
}

export function stamp(t: number): string {
  return `${fullDate(t)} ${clock(t)}`;
}

export function niceStep(span: number, count: number): number {
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
}

export function fixedAxis(min: number, max: number, count = 5): Axis {
  const step = niceStep(max - min, count);
  const ticks: number[] = [];
  for (let v = min; v <= max + step / 1000; v += step) ticks.push(+v.toFixed(2));
  return { min, max, ticks };
}

export function niceAxis(lo: number, hi: number, count = 5): Axis {
  const step = niceStep(hi - lo || 1, count);
  return fixedAxis(Math.floor(lo / step) * step, Math.ceil(hi / step) * step, count);
}

// Maps v from the axis range onto [from, to]
export function scale(v: number, axis: { min: number; max: number }, from: number, to: number): number {
  return from + ((v - axis.min) / (axis.max - axis.min || 1)) * (to - from);
}

export function options(values: string[]): DropdownOption[] {
  return Array.from(new Set(values)).map(v => ({ label: v, value: v }));
}

export function signed(value: number, decimals: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(decimals)}`;
}

// Pearson correlation of paired values; null when either side is constant
export function pearson(pairs: (readonly [number, number])[]): number | null {
  const n = pairs.length;
  if (n < 3) return null;
  const mx = pairs.reduce((sum, p) => sum + p[0], 0) / n;
  const my = pairs.reduce((sum, p) => sum + p[1], 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (const [x, y] of pairs) {
    sxy += (x - mx) * (y - my);
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
  }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : null;
}

// Evenly spaced time axis labels, at most ~14 across the span
export function timeTicks(start: number, end: number, x: (t: number) => number): { x: number; date: string; time: string }[] {
  const hours = (end - start) / HOUR;
  const steps = [1, 2, 3, 6, 12, 24, 48, 72, 120, 168, 336];
  const stepHours = steps.find(s => hours / s <= 14) ?? 336;
  const ticks = [];
  for (let t = start; t <= end; t += stepHours * HOUR) ticks.push({ x: x(t), date: shortDate(t), time: clock(t) });
  return ticks;
}

export function saveFile(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url));
}

export function exportSvg(svg: Element, name: string): void {
  const clone = svg.cloneNode(true) as Element;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('font-family', 'Inter, Arial, sans-serif');
  saveFile(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' }), name);
}

export function exportCsv(header: string[], rows: (string | number)[][], name: string): void {
  const csv = [header, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  saveFile(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), name);
}

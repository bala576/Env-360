// Geometry for the architectural floor plan drawn on the Space & Occupancy page.
// Everything is in SVG units of a 720x310 drawing.

import { Room } from './space.data';

export const PLAN = { width: 720, height: 310 };

// Building footprint; the margins left and right leave room for the legend and map controls
export const BUILDING = { x: 64, y: 14, w: 604, h: 284 };
export const CORRIDOR = { y: 116, h: 34 };

export interface Shape {
  t: 'rect' | 'circle' | 'line';
  cls: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  r?: number;
  rx?: number;
  x2?: number;
  y2?: number;
}

export interface RoomDrawing {
  floorCls: string;
  shapes: Shape[];
  // Centres of seating clusters; each gets its own heat blob
  clusters: { x: number; y: number }[];
  blobSize: number;
}

const rect = (cls: string, x: number, y: number, w: number, h: number, rx = 0): Shape => ({ t: 'rect', cls, x, y, w, h, rx });
const circle = (cls: string, x: number, y: number, r: number): Shape => ({ t: 'circle', cls, x, y, r });
const line = (cls: string, x: number, y: number, x2: number, y2: number): Shape => ({ t: 'line', cls, x, y, x2, y2 });

// Grid of cell origins that fit inside a box
function grid(x: number, y: number, w: number, h: number, cellW: number, cellH: number): { x: number; y: number }[] {
  const cols = Math.max(1, Math.floor(w / cellW));
  const rows = Math.max(1, Math.floor(h / cellH));
  // Centre the grid in the box
  const ox = x + (w - cols * cellW) / 2;
  const oy = y + (h - rows * cellH) / 2;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cells.push({ x: ox + c * cellW, y: oy + r * cellH });
  }
  return cells;
}

function plant(x: number, y: number, r = 4): Shape[] {
  return [circle('plant', x, y, r), circle('plant-core', x, y, r * 0.45)];
}

// Four desks back to back, monitors on the outer edges and a chair at each desk
function deskCluster(x: number, y: number): Shape[] {
  return [
    rect('desk', x, y, 11, 7, 1), rect('desk', x + 12, y, 11, 7, 1),
    rect('desk', x, y + 8, 11, 7, 1), rect('desk', x + 12, y + 8, 11, 7, 1),
    rect('monitor', x + 2.5, y + 1, 6, 1.6), rect('monitor', x + 14.5, y + 1, 6, 1.6),
    rect('monitor', x + 2.5, y + 12.4, 6, 1.6), rect('monitor', x + 14.5, y + 12.4, 6, 1.6),
    circle('chair', x + 5.5, y - 3.5, 2.6), circle('chair', x + 17.5, y - 3.5, 2.6),
    circle('chair', x + 5.5, y + 18.5, 2.6), circle('chair', x + 17.5, y + 18.5, 2.6),
  ];
}

function roundTable(cx: number, cy: number): Shape[] {
  return [
    circle('chair', cx, cy - 10, 2.6), circle('chair', cx, cy + 10, 2.6),
    circle('chair', cx - 10, cy, 2.6), circle('chair', cx + 10, cy, 2.6),
    circle('table', cx, cy, 6.5),
  ];
}

function sofaGroup(x: number, y: number): Shape[] {
  return [
    rect('sofa', x, y, 26, 7, 2.5), rect('sofa', x, y + 7, 7, 17, 2.5), rect('sofa', x + 19, y + 7, 7, 17, 2.5),
    rect('table', x + 9, y + 11, 8, 8, 1.5),
  ];
}

export function drawRoom(room: Room): RoomDrawing {
  const { x, y, w, h } = room;
  const shapes: Shape[] = [];
  const clusters: { x: number; y: number }[] = [];
  const inner = { x: x + 6, y: y + 22, w: w - 12, h: h - 28 };

  switch (room.furniture) {
    case 'tables': {
      grid(inner.x, inner.y, inner.w, inner.h, 32, 32).forEach(c => {
        shapes.push(...roundTable(c.x + 16, c.y + 16));
        clusters.push({ x: c.x + 16, y: c.y + 16 });
      });
      shapes.push(...plant(x + w - 7, y + 7, 3.5));
      return { floorCls: 'fl-wood', shapes, clusters, blobSize: 26 };
    }
    case 'meeting': {
      const vertical = w < 80;
      if (vertical) {
        const tx = x + w / 2 - 7;
        const tw = 14;
        const th = h - 40;
        shapes.push(rect('table', tx, y + 26, tw, th, 3));
        for (let cy = y + 32; cy < y + 26 + th - 2; cy += 11) {
          shapes.push(circle('chair', tx - 4, cy, 2.6), circle('chair', tx + tw + 4, cy, 2.6));
        }
        clusters.push({ x: x + w / 2, y: y + 26 + th / 2 });
      } else {
        const tw = Math.min(w - 40, 120);
        const tx = x + (w - tw) / 2;
        const ty = y + h / 2 + 2;
        shapes.push(rect('table', tx, ty, tw, 16, 4));
        for (let cx = tx + 7; cx < tx + tw - 2; cx += 12) {
          shapes.push(circle('chair', cx, ty - 4, 2.6), circle('chair', cx, ty + 20, 2.6));
        }
        for (let cx = tx + 22; cx < tx + tw; cx += 40) clusters.push({ x: cx, y: ty + 8 });
      }
      shapes.push(...plant(x + 7, y + h - 7, 3.5));
      return { floorCls: 'fl-glass', shapes, clusters, blobSize: 24 };
    }
    case 'desks': {
      grid(inner.x, inner.y + 2, inner.w, inner.h - 2, 34, 34).forEach(c => {
        shapes.push(...deskCluster(c.x + 5.5, c.y + 9));
        clusters.push({ x: c.x + 17, y: c.y + 16.5 });
      });
      return { floorCls: 'fl-carpet', shapes, clusters, blobSize: 22 };
    }
    case 'lounge': {
      grid(inner.x, inner.y, inner.w, inner.h, 44, 36).forEach((c, i) => {
        if (i % 3 === 2) {
          shapes.push(...roundTable(c.x + 22, c.y + 18));
        } else {
          shapes.push(...sofaGroup(c.x + 9, c.y + 6));
        }
        clusters.push({ x: c.x + 22, y: c.y + 18 });
      });
      shapes.push(...plant(x + w - 8, y + 8, 4), ...plant(x + 8, y + h - 8, 4));
      return { floorCls: 'fl-lounge', shapes, clusters, blobSize: 28 };
    }
    case 'stage': {
      shapes.push(rect('stage', x + 10, y + 24, w - 20, 16, 2));
      grid(x + 10, y + 46, w - 20, h - 52, 10, 10).forEach(c => shapes.push(circle('chair', c.x + 5, c.y + 5, 2.4)));
      grid(x + 10, y + 46, w - 20, h - 52, (w - 20) / 2, (h - 52) / 2).forEach(c =>
        clusters.push({ x: c.x + (w - 20) / 4, y: c.y + (h - 52) / 4 }));
      return { floorCls: 'fl-event', shapes, clusters, blobSize: 28 };
    }
  }
}

// Building shell, corridor, service cores and planting; the same on every floor
export function buildingDecor(): Shape[] {
  const b = BUILDING;
  const shapes: Shape[] = [
    rect('shell', b.x, b.y, b.w, b.h, 6),
    rect('corridor', b.x + 4, CORRIDOR.y, b.w - 8, CORRIDOR.h),
  ];

  // Windows along the outer walls
  for (let x = b.x + 16; x < b.x + b.w - 30; x += 46) {
    shapes.push(line('window', x, b.y, x + 30, b.y), line('window', x, b.y + b.h, x + 30, b.y + b.h));
  }

  // Lift and stair core between Focus Pods and the collaboration area
  const core = { x: 416, y: 20, w: 48, h: 96 };
  shapes.push(rect('core', core.x, core.y, core.w, core.h, 2));
  [core.y + 6, core.y + 34].forEach(ly => {
    shapes.push(rect('lift', core.x + 5, ly, 17, 24, 1.5), line('lift-x', core.x + 5, ly, core.x + 22, ly + 24), line('lift-x', core.x + 22, ly, core.x + 5, ly + 24));
    shapes.push(rect('lift', core.x + 26, ly, 17, 24, 1.5), line('lift-x', core.x + 26, ly, core.x + 43, ly + 24), line('lift-x', core.x + 43, ly, core.x + 26, ly + 24));
  });
  for (let sy = core.y + 64; sy < core.y + core.h - 4; sy += 4) shapes.push(line('stair', core.x + 6, sy, core.x + core.w - 6, sy));

  // Restrooms between the main cafeteria and the first workstation zone
  const wc = { x: 224, y: 150, w: 18, h: 142 };
  shapes.push(rect('core', wc.x, wc.y, wc.w, wc.h, 2));
  for (let sy = wc.y + 8; sy < wc.y + wc.h - 10; sy += 16) shapes.push(rect('fixture', wc.x + 4, sy, 10, 10, 3));

  // Open hot-desk spine in the middle of the lower floor
  const spine = { x: 362, y: 150, w: 50, h: 142 };
  shapes.push(rect('fl-open', spine.x, spine.y, spine.w, spine.h, 2));
  for (let sy = spine.y + 12; sy < spine.y + spine.h - 24; sy += 34) shapes.push(...deskCluster(spine.x + 13.5, sy));

  // Planters along the corridor
  for (let px = b.x + 30; px < b.x + b.w - 20; px += 64) shapes.push(...plant(px, CORRIDOR.y + 6, 4), ...plant(px + 20, CORRIDOR.y + CORRIDOR.h - 6, 3.4));

  return shapes;
}

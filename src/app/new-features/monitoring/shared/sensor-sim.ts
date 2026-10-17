// Deterministic sensor simulation shared by the Multi-Parameter and Data Explorer tabs.
// Replace with API calls when available.
import { MP_PARAMETERS, MpParameter, MpPoint } from '../multi-parameter/multi-parameter.data';
import { DAY, MINUTE, SLOT, hash } from './chart-utils';

export interface Sample {
  t: number;
  v: number;
}

// Door and defrost are shared signals that also drive the continuous readings
function doorOpen(point: MpPoint, slot: number, hour: number): number {
  const busy = hour >= 8 && hour < 22 ? 0.025 : 0.004;
  return hash(Math.floor(slot / 2), point.seed * 17 + 5) < busy ? 1 : 0;
}

function defrostOn(point: MpPoint, t: number): number {
  const d = new Date(t);
  const minutes = d.getHours() * 60 + d.getMinutes() + point.seed * 37;
  return minutes % 360 < 30 ? 1 : 0;
}

// A small share of readings are reconstructed rather than measured
export function isEstimated(point: MpPoint, t: number): boolean {
  return hash(Math.floor(t / SLOT), point.seed * 19 + 555) < 0.01;
}

export function simulate(point: MpPoint, param: MpParameter, start: number, end: number, interval: number): Sample[] {
  const step = interval * MINUTE;
  const seed = point.seed * 31 + MP_PARAMETERS.indexOf(param) * 7;
  const room = point.seed * 13;
  const offset = point.offsets?.[param.key] ?? 0;
  const samples: Sample[] = [];
  for (let t = start; t < end; t += step) {
    const slot = Math.floor(t / SLOT);
    if (hash(slot, seed + 333) < 0.004) continue;
    const hour = new Date(t).getHours() + new Date(t).getMinutes() / 60;
    const door = doorOpen(point, slot, hour);
    const defrost = defrostOn(point, t);
    // Shared room drivers so related parameters move together
    const drive = 0.5 * Math.sin(((hour - 8) / 24) * Math.PI * 2) + 0.3 * Math.sin(slot / 97 + room) + 0.7 * (hash(Math.floor(slot / 6), room) - 0.5);
    const noise = (hash(slot, seed) - 0.5) * 2;
    const spike = hash(slot, room + 99) < 0.003;
    let v: number;
    switch (param.key) {
      case 'temperature':
        v = -19 + offset + 1.3 * drive + 1.6 * door + 3.2 * defrost + 0.5 * noise + (spike ? 11.5 : 0);
        break;
      case 'humidity':
        v = 80 + offset - 4 * drive + 5 * door - 3 * defrost + 1.6 * noise - (spike ? 10 : 0);
        break;
      case 'energy':
        v = Math.max(0.1, 0.85 + offset + 0.9 * drive + 0.7 * door + 0.9 * defrost + 0.12 * noise + (hash(slot, seed + 41) < 0.012 ? 2 + 3 * hash(slot, seed + 42) : 0));
        break;
      case 'co2':
        v = 690 + offset + 160 * drive - 70 * door + 35 * noise + (spike ? 420 : 0);
        break;
      case 'door':
        v = door;
        break;
      case 'defrost':
        v = defrost;
        break;
      case 'compressor':
        // Runs harder when the room warms up or the door opens; off during defrost
        v = !defrost && drive + 0.8 * door + 0.25 * noise > -0.05 ? 1 : 0;
        break;
      case 'pressure':
        v = 12 + offset + 2 * drive - 6 * door + 0.6 * noise;
        break;
      case 'battery':
        // Slow discharge since installation, recharged every 120 days
        v = 96 - ((t / DAY) % 120) * 0.6 + 0.3 * noise;
        break;
      default:
        v = -68 + offset + 3 * Math.sin(slot / 211 + room) + 4 * noise;
    }
    samples.push({ t, v: +v.toFixed(Math.max(param.decimals, 2)) });
  }
  return samples;
}

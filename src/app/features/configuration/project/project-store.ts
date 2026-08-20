import { Injectable } from '@angular/core';
import { LocationNode } from './location-tree-node/location-tree-node';

export const LEVEL_NAMES = ['Project', 'Country', 'Area', 'Building', 'Floor', 'Zone', 'Sub Zone'];

function buildDummyTree(): LocationNode {
  const azyFloor: LocationNode = { id: 'LOC-006', name: 'Azy floor', latitude: 23.5906, longitude: 58.4076, children: [], expanded: false };
  const thirdRight: LocationNode = { id: 'LOC-005', name: 'Third Right', latitude: 23.5901, longitude: 58.4070, children: [azyFloor], expanded: false };
  const streetColony: LocationNode = { id: 'LOC-004', name: 'Street Colony', latitude: 23.5893, longitude: 58.4061, children: [thirdRight], expanded: false };
  const streetOne: LocationNode = { id: 'LOC-003', name: 'Street One', latitude: 23.5880, longitude: 58.4050, children: [streetColony], expanded: false };
  const oman: LocationNode = { id: 'LOC-002', name: 'Oman', latitude: 23.5859, longitude: 58.4059, children: [streetOne], expanded: false };
  const uae: LocationNode = { id: 'LOC-001', name: 'UAE', latitude: 23.4241, longitude: 53.8478, children: [oman], expanded: false };
  return uae;
}

@Injectable({ providedIn: 'root' })
export class ProjectStore {

  levelNames = LEVEL_NAMES;
  projects: LocationNode[] = [buildDummyTree()];
  nextId = 1000;

  generateId(): string {
    return `LOC-${this.nextId++}`;
  }

  levelLabelForDepth(depth: number): string {
    return this.levelNames[depth] ?? 'Sub-level';
  }

  removeNodeById(id: string): boolean {
    return this.removeFrom(this.projects, id);
  }

  private removeFrom(list: LocationNode[], id: string): boolean {
    const index = list.findIndex(n => n.id === id);
    if (index !== -1) {
      list.splice(index, 1);
      return true;
    }
    return list.some(n => this.removeFrom(n.children, id));
  }
}

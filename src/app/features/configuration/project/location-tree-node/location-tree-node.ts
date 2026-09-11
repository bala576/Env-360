import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface LocationNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  weekStart?: string;
  weekEnd?: string;
  status?: string;
  description?: string;
  timeZone?: string;
  countryCode?: string;
  outdoorMap?: string;
  zoomLevel?: number;
  mapImage?: string;
  topZone?: string;
  priority?: number;
  exit?: string;
  kind?: 'outdoor';
  children: LocationNode[];
  expanded: boolean;
}

export interface LocationNodeEvent {
  node: LocationNode;
  depth: number;
  kind?: 'outdoor';
}

@Component({
  selector: 'app-location-tree-node',
  imports: [CommonModule, LocationTreeNode],
  templateUrl: './location-tree-node.html',
  styleUrl: './location-tree-node.css',
})
export class LocationTreeNode {

  @Input() node!: LocationNode;
  @Input() depth = 0;
  @Input() selectedId: string | null = null;
  @Input() showActions = true;
  @Input() maxDepth = Infinity;
  @Input() levelNames: string[] = [];

  @Output() select = new EventEmitter<LocationNode>();
  @Output() addChild = new EventEmitter<LocationNodeEvent>();
  @Output() editNode = new EventEmitter<LocationNodeEvent>();
  @Output() deleteNode = new EventEmitter<LocationNodeEvent>();

  get addLabel(): string {
    return this.levelNames[this.depth + 1] ?? 'Item';
  }

  get buildingLabel(): string {
    return this.levelNames[this.depth + 1] ?? 'Building';
  }

  onRowClick(): void {
    if (this.node.children.length) {
      this.node.expanded = !this.node.expanded;
    }
    this.select.emit(this.node);
  }

  get orderedChildren(): LocationNode[] {
    const rank = (n: LocationNode) => (n.kind === 'outdoor' ? 0 : 1);
    return [...this.node.children].sort((a, b) => rank(a) - rank(b));
  }
}

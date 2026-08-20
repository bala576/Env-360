import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface LocationNode {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  children: LocationNode[];
  expanded: boolean;
}

export interface LocationNodeEvent {
  node: LocationNode;
  depth: number;
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

  @Output() select = new EventEmitter<LocationNode>();
  @Output() addChild = new EventEmitter<LocationNodeEvent>();
  @Output() editNode = new EventEmitter<LocationNodeEvent>();
  @Output() deleteNode = new EventEmitter<LocationNodeEvent>();

  onRowClick(): void {
    if (this.node.children.length) {
      this.node.expanded = !this.node.expanded;
    }
    this.select.emit(this.node);
  }
}

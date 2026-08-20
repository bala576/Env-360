import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LocationNode } from '../../../../configuration/project/location-tree-node/location-tree-node';

@Component({
  selector: 'app-hierarchy-tree-node',
  imports: [CommonModule, HierarchyTreeNode],
  templateUrl: './hierarchy-tree-node.html',
  styleUrl: './hierarchy-tree-node.css',
})
export class HierarchyTreeNode {

  @Input() node!: LocationNode;
  @Input() depth = 0;
  @Input() selectedIds!: Set<string>;

  @Output() toggle = new EventEmitter<LocationNode>();

  get isChecked(): boolean {
    return this.selectedIds.has(this.node.id);
  }

  toggleExpand(): void {
    if (this.node.children.length) this.node.expanded = !this.node.expanded;
  }

  onCheck(): void {
    this.toggle.emit(this.node);
  }

  onChildToggle(node: LocationNode): void {
    this.toggle.emit(node);
  }
}

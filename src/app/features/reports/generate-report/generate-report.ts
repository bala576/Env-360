import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { LocationNode, LocationTreeNode } from '../../configuration/project/location-tree-node/location-tree-node';

type ReportFormat = 'URL' | 'PDF' | 'CSV';
type Recurrence = 'Once' | 'Daily' | 'Weekly' | 'Monthly';

@Component({
  selector: 'app-generate-report',
  imports: [CommonModule, FormsModule, Breadcrumb, LocationTreeNode],
  templateUrl: './generate-report.html',
  styleUrl: './generate-report.css',
})
export class GenerateReport {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Report', route: '/report-list' },
    { label: 'Create Report' },
  ];

  treeSearch = '';
  trackers: LocationNode[] = [this.buildDummyTree()];
  selectedNode: LocationNode | null = null;

  reportName = '';

  moduleOptions = ['Device Management', 'Alarm Management', 'Environment Monitoring', 'Process & Automation', 'Locating'];
  selectedModule = this.moduleOptions[1];

  templateOptions = ['Device Health Report', 'Alarm Summary Report', 'Air Quality Report', 'Water Quality Report'];
  selectedTemplate = '';

  timeRangeUnits = ['Hours', 'Days', 'Weeks'];
  timeRangeUnit = '';
  timeRangePresets = ['1 Hours', '2 Hours', '4 Hours', '8 Hours', '24 Hours'];
  selectedPreset = '24 Hours';

  formats: ReportFormat[] = ['URL', 'PDF', 'CSV'];
  selectedFormat: ReportFormat = 'URL';

  recurrences: Recurrence[] = ['Once', 'Daily', 'Weekly', 'Monthly'];
  selectedRecurrence: Recurrence = 'Once';
  dailyTime = '';
  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  weeklyDay = this.weekDays[0];
  weeklyTime = '';
  monthlyDate = '';
  monthlyTime = '';

  shareWith = '';

  constructor(private router: Router) {
    this.selectedNode = this.trackers[0];
  }

  private buildDummyTree(): LocationNode {
    const zone: LocationNode = { id: 'LOC-006', name: 'Azy floor', latitude: 23.5906, longitude: 58.4076, children: [], expanded: false };
    const floor: LocationNode = { id: 'LOC-005', name: 'Third Right', latitude: 23.5901, longitude: 58.4070, children: [zone], expanded: true };
    const building: LocationNode = { id: 'LOC-004', name: 'Street Colony', latitude: 23.5893, longitude: 58.4061, children: [floor], expanded: true };
    const area: LocationNode = { id: 'LOC-003', name: 'Street One', latitude: 23.5880, longitude: 58.4050, children: [building], expanded: true };
    const country: LocationNode = { id: 'LOC-002', name: 'Oman', latitude: 23.5859, longitude: 58.4059, children: [area], expanded: true };
    const project: LocationNode = { id: 'LOC-001', name: 'UAE', latitude: 23.4241, longitude: 53.8478, children: [country], expanded: true };
    const root: LocationNode = { id: 'LOC-000', name: 'Track People', latitude: 23.4241, longitude: 53.8478, children: [project], expanded: true };
    this.selectDeep(root, zone.id);
    return root;
  }

  private selectDeep(node: LocationNode, targetId: string): boolean {
    if (node.id === targetId) {
      this.selectedNode = node;
      return true;
    }
    return node.children.some(child => this.selectDeep(child, targetId));
  }

  selectNode(node: LocationNode): void {
    this.selectedNode = node;
  }

  onTreeSearch(): void {
    const term = this.treeSearch.trim().toLowerCase();
    if (!term) return;
    const match = this.findNodeByName(this.trackers[0], term);
    if (match) this.selectNode(match);
  }

  private findNodeByName(node: LocationNode, term: string): LocationNode | null {
    if (node.name.toLowerCase().includes(term)) return node;
    for (const child of node.children) {
      const found = this.findNodeByName(child, term);
      if (found) return found;
    }
    return null;
  }

  selectPreset(preset: string): void {
    this.selectedPreset = preset;
    this.timeRangeUnit = '';
  }

  cancel(): void {
    this.router.navigate(['/report-list']);
  }

  createReport(): void {
    this.router.navigate(['/report-list']);
  }
}

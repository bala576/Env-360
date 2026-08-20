import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { LocationNode, LocationTreeNode } from '../../configuration/project/location-tree-node/location-tree-node';

const DEFAULT_LAT = 23.5906;
const DEFAULT_LNG = 58.4076;

@Component({
  selector: 'app-live-map',
  imports: [CommonModule, FormsModule, LocationTreeNode],
  templateUrl: './live-map.html',
  styleUrl: './live-map.css',
})
export class LiveMap implements AfterViewInit {

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  deviceTypes = ['Mobile', 'Fixed'];
  deviceType = this.deviceTypes[0];

  parameters = ['Heart Rate', 'Body Temp', 'Movement Status', 'Battery Level'];
  parameter = this.parameters[0];

  trackers: LocationNode[] = [this.buildDummyTree()];
  selectedNode: LocationNode | null = null;

  constructor() {
    this.selectedNode = this.trackers[0];
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([DEFAULT_LAT, DEFAULT_LNG], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.focusNode(this.selectedNode);
  }

  private buildDummyTree(): LocationNode {
    const zone: LocationNode = { id: 'LOC-006', name: 'Azy floor', latitude: 23.5906, longitude: 58.4076, children: [], expanded: false };
    const floor: LocationNode = { id: 'LOC-005', name: 'Third Right', latitude: 23.5901, longitude: 58.4070, children: [zone], expanded: false };
    const building: LocationNode = { id: 'LOC-004', name: 'Street Colony', latitude: 23.5893, longitude: 58.4061, children: [floor], expanded: false };
    const area: LocationNode = { id: 'LOC-003', name: 'Street One', latitude: 23.5880, longitude: 58.4050, children: [building], expanded: false };
    const country: LocationNode = { id: 'LOC-002', name: 'Oman', latitude: 23.5859, longitude: 58.4059, children: [area], expanded: false };
    const project: LocationNode = { id: 'LOC-001', name: 'UAE', latitude: 23.4241, longitude: 53.8478, children: [country], expanded: false };
    return project;
  }

  selectNode(node: LocationNode): void {
    this.selectedNode = node;
    this.focusNode(node);
  }

  private focusNode(node: LocationNode | null): void {
    if (!this.map || !node) return;
    const latLng: L.LatLngExpression = [node.latitude, node.longitude];
    if (this.marker) {
      this.marker.setLatLng(latLng);
    } else {
      this.marker = L.marker(latLng).addTo(this.map);
    }
    this.map.setView(latLng, this.map.getZoom());
  }
}

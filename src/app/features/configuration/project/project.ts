import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { GenericPopup } from '../../../shared/generic-popup/generic-popup';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN } from '../../../shared/layout/sidebar/admin-nav.data';
import { LocationNode, LocationNodeEvent, LocationTreeNode } from './location-tree-node/location-tree-node';
import { ProjectStore } from './project-store';

const DEFAULT_LAT = 23.5906;
const DEFAULT_LNG = 58.4076;

@Component({
  selector: 'app-project',
  imports: [CommonModule, ReactiveFormsModule, LocationTreeNode, GenericPopup, Breadcrumb],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project implements AfterViewInit {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Administration', children: ADMIN_TOP_DROPDOWN },
    { label: 'Configuration', children: CONFIGURATION_DROPDOWN },
    { label: 'Project' },
  ];

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  selectedNode: LocationNode | null = null;

  popupOpen = false;
  popupMode: 'add' | 'edit' = 'add';
  popupLevelLabel = '';
  private popupParentNode: LocationNode | null = null;
  private popupTargetNode: LocationNode | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, private store: ProjectStore) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      latitude: [DEFAULT_LAT, Validators.required],
      longitude: [DEFAULT_LNG, Validators.required],
    });

    this.selectedNode = this.projects[0];
  }

  get levelNames(): string[] {
    return this.store.levelNames;
  }

  get projects(): LocationNode[] {
    return this.store.projects;
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([DEFAULT_LAT, DEFAULT_LNG], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.focusNode(this.selectedNode);
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

  levelLabelForDepth(depth: number): string {
    return this.store.levelLabelForDepth(depth);
  }

  openAddRoot(): void {
    this.popupMode = 'add';
    this.popupParentNode = null;
    this.popupTargetNode = null;
    this.popupLevelLabel = this.levelLabelForDepth(0);
    this.form.reset({ name: '', latitude: DEFAULT_LAT, longitude: DEFAULT_LNG });
    this.popupOpen = true;
  }

  onAddChild(event: LocationNodeEvent): void {
    this.popupMode = 'add';
    this.popupParentNode = event.node;
    this.popupTargetNode = null;
    this.popupLevelLabel = this.levelLabelForDepth(event.depth + 1);
    this.form.reset({ name: '', latitude: event.node.latitude, longitude: event.node.longitude });
    this.popupOpen = true;
  }

  onEditNode(event: LocationNodeEvent): void {
    this.popupMode = 'edit';
    this.popupParentNode = null;
    this.popupTargetNode = event.node;
    this.popupLevelLabel = this.levelLabelForDepth(event.depth);
    this.form.reset({ name: event.node.name, latitude: event.node.latitude, longitude: event.node.longitude });
    this.popupOpen = true;
  }

  onDeleteNode(event: LocationNodeEvent): void {
    this.store.removeNodeById(event.node.id);
    if (this.selectedNode?.id === event.node.id) {
      this.selectedNode = this.projects.length ? this.projects[0] : null;
      this.focusNode(this.selectedNode);
    }
  }

  closePopup(): void {
    this.popupOpen = false;
    this.popupParentNode = null;
    this.popupTargetNode = null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.popupMode === 'edit' && this.popupTargetNode) {
      this.popupTargetNode.name = value.name;
      this.popupTargetNode.latitude = value.latitude;
      this.popupTargetNode.longitude = value.longitude;
      if (this.selectedNode?.id === this.popupTargetNode.id) {
        this.focusNode(this.popupTargetNode);
      }
    } else {
      const newNode: LocationNode = {
        id: this.store.generateId(),
        name: value.name,
        latitude: value.latitude,
        longitude: value.longitude,
        children: [],
        expanded: true,
      };

      if (this.popupParentNode) {
        this.popupParentNode.children.push(newNode);
        this.popupParentNode.expanded = true;
      } else {
        this.projects.push(newNode);
      }

      this.selectNode(newNode);
    }

    this.closePopup();
  }
}

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { GenericPopup } from '../../../shared/generic-popup/generic-popup';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';
import { FormToggle } from '../../../shared/form-toggle/form-toggle';
import { ADMIN_TOP_DROPDOWN, CONFIGURATION_DROPDOWN } from '../../../shared/layout/sidebar/admin-nav.data';
import { LocationNode, LocationNodeEvent, LocationTreeNode } from './location-tree-node/location-tree-node';
import { ProjectStore } from './project-store';

const DEFAULT_LAT = 23.5906;
const DEFAULT_LNG = 58.4076;

@Component({
  selector: 'app-project',
  imports: [CommonModule, ReactiveFormsModule, LocationTreeNode, GenericPopup, FormToggle, Breadcrumb],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project implements AfterViewInit {

  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeZones = ['Asia/Kolkata (GMT+5:30)', 'UTC (GMT+0:00)', 'America/New_York (GMT-5:00)', 'Asia/Singapore (GMT+8:00)'];
  outdoorMapOptions = ['Online', 'Offline'];

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
  popupDepth = 0;
  popupKind: 'default' | 'outdoor' = 'default';
  private popupParentNode: LocationNode | null = null;
  private popupTargetNode: LocationNode | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, private store: ProjectStore) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      weekStart: ['Sunday'],
      weekEnd: ['Thursday'],
      status: ['Active', Validators.required],
      description: [''],
      timeZone: [''],
      countryCode: [''],
      outdoorMap: ['Online'],
      latitude: [DEFAULT_LAT],
      longitude: [DEFAULT_LNG],
      zoomLevel: [15],
      mapImage: [''],
      topZone: [''],
      priority: [1],
      exit: [''],
    });

    this.selectedNode = this.projects[0];
  }

  get levelNames(): string[] {
    return this.store.levelNames;
  }

  get projects(): LocationNode[] {
    return this.store.projects;
  }

  get maxDepth(): number {
    return this.levelNames.length - 1;
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
    this.map.setView(latLng, node.zoomLevel ?? this.map.getZoom());
  }

  levelLabelForDepth(depth: number): string {
    return this.store.levelLabelForDepth(depth);
  }

  private resetFormForAdd(depth: number, parent: LocationNode | null): void {
    this.popupDepth = depth;
    const lat = parent?.latitude ?? DEFAULT_LAT;
    const lng = parent?.longitude ?? DEFAULT_LNG;

    if (depth === 1) {
      this.form.reset({
        name: '',
        description: '',
        timeZone: this.timeZones[0],
        countryCode: '',
        latitude: lat,
        longitude: lng,
        zoomLevel: 15,
        status: 'Active',
      });
    } else if (depth === 2) {
      this.form.reset({
        name: '',
        description: '',
        outdoorMap: 'Online',
        latitude: lat,
        longitude: lng,
        zoomLevel: 15,
        status: 'Active',
      });
    } else if (depth === 3) {
      this.form.reset({
        name: '',
        description: '',
        latitude: lat,
        longitude: lng,
        zoomLevel: 15,
        status: 'Active',
      });
    } else if (depth === 4) {
      this.form.reset({ name: '', description: '', mapImage: '', status: 'Active' });
    } else if (depth === 5) {
      this.form.reset({
        name: '',
        description: '',
        mapImage: '',
        topZone: '',
        priority: 1,
        exit: '',
        zoomLevel: 15,
        status: 'Active',
      });
    } else if (depth === 6) {
      this.form.reset({
        name: '',
        description: '',
        topZone: '',
        mapImage: '',
        priority: 1,
        exit: '',
        status: 'Active',
      });
    } else {
      this.form.reset({ name: '', weekStart: 'Sunday', weekEnd: 'Thursday', status: 'Active', description: '' });
    }
  }

  onMapImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.form.get('mapImage')?.setValue(reader.result as string);
    reader.readAsDataURL(file);
  }

  openAddRoot(): void {
    this.popupMode = 'add';
    this.popupParentNode = null;
    this.popupTargetNode = null;
    this.popupKind = 'default';
    this.popupLevelLabel = this.levelLabelForDepth(0);
    this.resetFormForAdd(0, null);
    this.popupOpen = true;
  }

  onAddChild(event: LocationNodeEvent): void {
    this.popupMode = 'add';
    this.popupParentNode = event.node;
    this.popupTargetNode = null;
    this.popupKind = event.kind === 'outdoor' ? 'outdoor' : 'default';
    this.popupLevelLabel = this.popupKind === 'outdoor' ? 'Outdoor Zone' : this.levelLabelForDepth(event.depth + 1);
    this.resetFormForAdd(event.depth + 1, event.node);
    this.popupOpen = true;
  }

  onEditNode(event: LocationNodeEvent): void {
    this.popupMode = 'edit';
    this.popupParentNode = null;
    this.popupTargetNode = event.node;
    this.popupKind = event.node.kind === 'outdoor' ? 'outdoor' : 'default';
    this.popupLevelLabel = this.popupKind === 'outdoor' ? 'Outdoor Zone' : this.levelLabelForDepth(event.depth);
    this.popupDepth = event.depth;
    if (event.depth === 1) {
      this.form.reset({
        name: event.node.name,
        description: event.node.description,
        timeZone: event.node.timeZone,
        countryCode: event.node.countryCode,
        latitude: event.node.latitude,
        longitude: event.node.longitude,
        zoomLevel: event.node.zoomLevel,
        status: event.node.status,
      });
    } else if (event.depth === 2) {
      this.form.reset({
        name: event.node.name,
        description: event.node.description,
        outdoorMap: event.node.outdoorMap,
        latitude: event.node.latitude,
        longitude: event.node.longitude,
        zoomLevel: event.node.zoomLevel,
        status: event.node.status,
      });
    } else if (event.depth === 3) {
      this.form.reset({
        name: event.node.name,
        description: event.node.description,
        latitude: event.node.latitude,
        longitude: event.node.longitude,
        zoomLevel: event.node.zoomLevel,
        status: event.node.status,
      });
    } else if (event.depth === 4) {
      this.form.reset({
        name: event.node.name,
        description: event.node.description,
        mapImage: event.node.mapImage,
        status: event.node.status,
      });
    } else if (event.depth === 5) {
      this.form.reset({
        name: event.node.name,
        description: event.node.description,
        mapImage: event.node.mapImage,
        topZone: event.node.topZone,
        priority: event.node.priority,
        exit: event.node.exit,
        zoomLevel: event.node.zoomLevel,
        status: event.node.status,
      });
    } else if (event.depth === 6) {
      this.form.reset({
        name: event.node.name,
        description: event.node.description,
        topZone: event.node.topZone,
        mapImage: event.node.mapImage,
        priority: event.node.priority,
        exit: event.node.exit,
        status: event.node.status,
      });
    } else {
      this.form.reset({
        name: event.node.name,
        weekStart: event.node.weekStart,
        weekEnd: event.node.weekEnd,
        status: event.node.status,
        description: event.node.description,
      });
    }
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
    this.popupKind = 'default';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.popupMode === 'edit' && this.popupTargetNode) {
      this.popupTargetNode.name = value.name;
      this.popupTargetNode.status = value.status;
      this.popupTargetNode.description = value.description;
      if (this.popupDepth === 1) {
        this.popupTargetNode.timeZone = value.timeZone;
        this.popupTargetNode.countryCode = value.countryCode;
        this.popupTargetNode.latitude = value.latitude;
        this.popupTargetNode.longitude = value.longitude;
        this.popupTargetNode.zoomLevel = value.zoomLevel;
      } else if (this.popupDepth === 2) {
        this.popupTargetNode.outdoorMap = value.outdoorMap;
        this.popupTargetNode.latitude = value.latitude;
        this.popupTargetNode.longitude = value.longitude;
        this.popupTargetNode.zoomLevel = value.zoomLevel;
      } else if (this.popupDepth === 3) {
        this.popupTargetNode.latitude = value.latitude;
        this.popupTargetNode.longitude = value.longitude;
        this.popupTargetNode.zoomLevel = value.zoomLevel;
      } else if (this.popupDepth === 4) {
        this.popupTargetNode.mapImage = value.mapImage;
      } else if (this.popupDepth === 5) {
        this.popupTargetNode.mapImage = value.mapImage;
        this.popupTargetNode.topZone = value.topZone;
        this.popupTargetNode.priority = value.priority;
        this.popupTargetNode.exit = value.exit;
        this.popupTargetNode.zoomLevel = value.zoomLevel;
      } else if (this.popupDepth === 6) {
        this.popupTargetNode.topZone = value.topZone;
        this.popupTargetNode.mapImage = value.mapImage;
        this.popupTargetNode.priority = value.priority;
        this.popupTargetNode.exit = value.exit;
      } else {
        this.popupTargetNode.weekStart = value.weekStart;
        this.popupTargetNode.weekEnd = value.weekEnd;
      }
      if (this.selectedNode?.id === this.popupTargetNode.id) {
        this.focusNode(this.popupTargetNode);
      }
    } else {
      const hasOwnCoords = this.popupDepth === 1 || this.popupDepth === 2 || this.popupDepth === 3;
      const parentLat = this.popupParentNode?.latitude ?? DEFAULT_LAT;
      const parentLng = this.popupParentNode?.longitude ?? DEFAULT_LNG;
      const newNode: LocationNode = {
        id: this.store.generateId(),
        name: value.name,
        latitude: hasOwnCoords ? value.latitude : parentLat,
        longitude: hasOwnCoords ? value.longitude : parentLng,
        status: value.status,
        description: value.description,
        children: [],
        expanded: true,
      };

      if (this.popupDepth === 1) {
        newNode.timeZone = value.timeZone;
        newNode.countryCode = value.countryCode;
        newNode.zoomLevel = value.zoomLevel;
      } else if (this.popupDepth === 2) {
        newNode.outdoorMap = value.outdoorMap;
        newNode.zoomLevel = value.zoomLevel;
        newNode.children.push({
          id: this.store.generateId(),
          name: 'Outdoor Zone',
          latitude: newNode.latitude,
          longitude: newNode.longitude,
          zoomLevel: newNode.zoomLevel,
          status: 'Active',
          description: '',
          kind: 'outdoor',
          children: [],
          expanded: false,
        });
      } else if (this.popupDepth === 3) {
        newNode.zoomLevel = value.zoomLevel;
      } else if (this.popupDepth === 4) {
        newNode.mapImage = value.mapImage;
      } else if (this.popupDepth === 5) {
        newNode.mapImage = value.mapImage;
        newNode.topZone = value.topZone;
        newNode.priority = value.priority;
        newNode.exit = value.exit;
        newNode.zoomLevel = value.zoomLevel;
      } else if (this.popupDepth === 6) {
        newNode.topZone = value.topZone;
        newNode.mapImage = value.mapImage;
        newNode.priority = value.priority;
        newNode.exit = value.exit;
      } else {
        newNode.weekStart = value.weekStart;
        newNode.weekEnd = value.weekEnd;
      }

      if (this.popupKind === 'outdoor') {
        newNode.kind = 'outdoor';
      }

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

import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcessAutomationService } from '../services/process-automation.service';
import { Breadcrumb, BreadcrumbItem } from '../../../shared/breadcrumb/breadcrumb';

export type LogicOperator = 'AND' | 'OR';

export type ConditionType =
  | ''
  | 'When the device is'
  | 'When the time is'
  | 'When the people is'
  | 'When the zone is';

export type ConditionField =
  | 'type'
  | 'device'
  | 'property'
  | 'compare'
  | 'people'
  | 'zone'
  | null;

export interface ConditionRow {
  id: number;
  operator: LogicOperator;

  type: ConditionType;

  device: string;
  property: string;
  compareOp: string;

  people: string;

  zone: string;

  startHH: string;
  startMM: string;
  endHH: string;
  endMM: string;
  days: string[];

  openField: ConditionField;
}

export type ActionType =
  | ''
  | 'Trigger device(s) to..'
  | 'Send an alarm notification';

export type ActionField =
  | 'type'
  | 'device'
  | 'deviceType'
  | 'status'
  | null;

export interface ActionRow {
  id: number;

  value: ActionType;

  device: string;
  deviceType: string;
  status: string;

  notifyChannels: string[];

  openField: ActionField;
}

export interface AutomationListItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-process-automation',
  imports: [CommonModule, FormsModule, Breadcrumb],
  providers: [ProcessAutomationService],
  templateUrl: './create-process-automation.html',
  styleUrl: './create-process-automation.css',
})
export class CreateProcessAutomation {

  breadcrumb: BreadcrumbItem[] = [
    { label: 'Process & Automation', route: '/process-automation' },
    { label: 'Create Rule' },
  ];

  // ----- Sidebar -----
  searchTerm = '';

  automations: AutomationListItem[] = [
    { id: 1, name: 'Track People' },
  ];

  selectedAutomationId: number | null = 1;

  get filteredAutomations(): AutomationListItem[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.automations;
    return this.automations.filter(a => a.name.toLowerCase().includes(term));
  }

  selectAutomation(item: AutomationListItem): void {
    this.selectedAutomationId = item.id;
  }

  // ----- Main form -----
  title = '';

  conditionTypeOptions: ConditionType[] = [
    'When the device is',
    'When the time is',
    'When the people is',
    'When the zone is',
  ];

  deviceOptions = ['Device 1', 'Device 2', 'Device 3'];
  propertyOptions = ['Energy Saved', 'Energy Consumed', 'Status'];
  compareOptionsNumeric = ['Less than', 'Greater than', 'Equal to', 'Not equal to'];
  compareOptionsStatus = ['Online', 'Offline'];

  peopleOptions = ['Person 1', 'Person 2', 'Person 3'];
  zoneOptions = ['Zone 1', 'Zone 2', 'Zone 3'];

  dayOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  minuteOptions = ['00', '15', '30', '45'];

  actionOptions: ActionType[] = [
    'Trigger device(s) to..',
    'Send an alarm notification',
  ];

  actionDeviceOptions = ['Light Sensor', 'Gas Sensor', 'Controller'];
  actionDeviceTypeOptions = ['Testing for display name', 'Testing for indoor', 'Testing for outdoor'];
  actionStatusOptions = ['Online', 'Offline'];

  notifyChannelOptions = ['Dashboard', 'Email', 'Alarm'];

  private conditionRowId = 1;
  private actionRowId = 1;

  conditions: ConditionRow[] = [this.newConditionRow()];

  actions: ActionRow[] = [this.newActionRow()];

  setTimePeriod = false;

  submitted = false;

  constructor(
    private service: ProcessAutomationService,
    private router: Router,
    private elRef: ElementRef,
  ) {}

  private newConditionRow(): ConditionRow {
    return {
      id: this.conditionRowId++,
      operator: 'AND',
      type: '',
      device: '',
      property: '',
      compareOp: '',
      people: '',
      zone: '',
      startHH: '',
      startMM: '',
      endHH: '',
      endMM: '',
      days: [],
      openField: null,
    };
  }

  private newActionRow(): ActionRow {
    return {
      id: this.actionRowId++,
      value: '',
      device: '',
      deviceType: '',
      status: '',
      notifyChannels: [],
      openField: null,
    };
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.elRef.nativeElement.contains(target)) {
      this.closeAllDropdowns();
      return;
    }
    if (!target.closest('.pa-dropdown-wrap')) {
      this.closeAllDropdowns();
    }
  }

  private closeAllDropdowns(): void {
    this.conditions.forEach(c => (c.openField = null));
    this.actions.forEach(a => (a.openField = null));
  }

  get relationshipLabel(): string {
    return this.conditions
      .map((c, i) => {
        const letter = String.fromCharCode(65 + i);
        return i === 0 ? letter : c.operator + letter;
      })
      .join('');
  }

  conditionLabel(index: number): string {
    return 'Condition ' + String.fromCharCode(65 + index);
  }

  toggleField(row: ConditionRow, field: ConditionField): void {
    const wasOpenOnThisField = row.openField === field;
    this.closeAllDropdowns();
    row.openField = wasOpenOnThisField ? null : field;
  }

  selectType(row: ConditionRow, type: ConditionType): void {
    row.type = type;
    row.device = '';
    row.property = '';
    row.compareOp = '';
    row.people = '';
    row.zone = '';
    row.startHH = '';
    row.startMM = '';
    row.endHH = '';
    row.endMM = '';
    row.days = [];
    row.openField = null;
  }

  selectDevice(row: ConditionRow, device: string): void {
    row.device = device;
    row.property = '';
    row.compareOp = '';
    row.openField = null;
  }

  selectProperty(row: ConditionRow, property: string): void {
    row.property = property;
    row.compareOp = '';
    row.openField = null;
  }

  selectCompare(row: ConditionRow, op: string): void {
    row.compareOp = op;
    row.openField = null;
  }

  compareOptionsFor(row: ConditionRow): string[] {
    return row.property === 'Status' ? this.compareOptionsStatus : this.compareOptionsNumeric;
  }

  selectPeople(row: ConditionRow, value: string): void {
    row.people = value;
    row.openField = null;
  }

  selectZone(row: ConditionRow, value: string): void {
    row.zone = value;
    row.openField = null;
  }

  toggleDay(row: ConditionRow, day: string): void {
    const idx = row.days.indexOf(day);
    if (idx > -1) {
      row.days.splice(idx, 1);
    } else {
      row.days.push(day);
    }
  }

  isDaySelected(row: ConditionRow, day: string): boolean {
    return row.days.includes(day);
  }

  effectiveTimeLabel(row: ConditionRow): string {
    const start = (row.startHH || '00') + ':' + (row.startMM || '00');
    const end = (row.endHH || '23') + ':' + (row.endMM || '59');
    return `Effective Time: ${start} - ${end}`;
  }

  addCondition(): void {
    this.conditions.push(this.newConditionRow());
  }

  removeCondition(id: number): void {
    if (this.conditions.length === 1) return;
    this.conditions = this.conditions.filter(c => c.id !== id);
  }

  actionLabel(index: number): string {
    return 'Action ' + String.fromCharCode(65 + index);
  }

  toggleActionField(row: ActionRow, field: ActionField): void {
    const wasOpenOnThisField = row.openField === field;
    this.closeAllDropdowns();
    row.openField = wasOpenOnThisField ? null : field;
  }

  selectActionType(row: ActionRow, type: ActionType): void {
    row.value = type;
    row.device = '';
    row.deviceType = '';
    row.status = '';
    row.notifyChannels = [];
    row.openField = null;
  }

  selectActionDevice(row: ActionRow, device: string): void {
    row.device = device;
    row.deviceType = '';
    row.status = '';
    row.openField = null;
  }

  selectActionDeviceType(row: ActionRow, type: string): void {
    row.deviceType = type;
    row.status = '';
    row.openField = null;
  }

  selectActionStatus(row: ActionRow, status: string): void {
    row.status = status;
    row.openField = null;
  }

  toggleNotifyChannel(row: ActionRow, channel: string): void {
    const idx = row.notifyChannels.indexOf(channel);
    if (idx > -1) {
      row.notifyChannels.splice(idx, 1);
    } else {
      row.notifyChannels.push(channel);
    }
  }

  isNotifyChannelSelected(row: ActionRow, channel: string): boolean {
    return row.notifyChannels.includes(channel);
  }

  addAction(): void {
    this.actions.push(this.newActionRow());
  }

  removeAction(id: number): void {
    if (this.actions.length === 1) return;
    this.actions = this.actions.filter(a => a.id !== id);
  }

  create(): void {
    this.submitted = true;
    if (!this.title.trim()) return;

    const payload = {
      title: this.title.trim(),
      relationship: this.relationshipLabel,
      conditions: this.conditions.map(c => ({
        operator: c.operator,
        type: c.type,
        device: c.device,
        property: c.property,
        compareOp: c.compareOp,
        people: c.people,
        zone: c.zone,
        time: c.type === 'When the time is'
          ? {
              start: (c.startHH || '00') + ':' + (c.startMM || '00'),
              end: (c.endHH || '23') + ':' + (c.endMM || '59'),
              days: c.days,
            }
          : null,
      })),
      setTimePeriod: this.setTimePeriod,
      actions: this.actions
        .filter(a => !!a.value)
        .map(a => ({
          type: a.value,
          device: a.device,
          deviceType: a.deviceType,
          status: a.status,
          notifyChannels: a.notifyChannels,
        })),
    };

    this.service.addRule(payload);
    this.router.navigate(['/process-automation']);
  }

  cancel(): void {
    this.router.navigate(['/process-automation']);
  }
}

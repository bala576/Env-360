import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GenericPopup } from '../../../shared/generic-popup/generic-popup';

interface WidgetDetail {
  title: string;
  rows?: { label: string; value: string }[];
  note?: string;
}

interface StatCard {
  iconBg: string;
  icon: 'sites' | 'devices' | 'sensors' | 'alarms' | 'compliance';
  color: string;
  label: string;
  value: string;
  sub: string;
  subType: 'up' | 'down';
}

interface DonutSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
}

interface PrioritySensor {
  icon: 'temp' | 'humidity' | 'water' | 'energy' | 'door' | 'refrigerant' | 'gas' | 'co';
  iconBg: string;
  color: string;
  title: string;
  description: string;
}

interface EnvTile {
  icon: 'temp' | 'humidity' | 'energy' | 'water' | 'refrigerant' | 'gas' | 'co' | 'door';
  color: string;
  label: string;
  value: string;
  status: 'normal' | 'critical';
  points: string;
}

interface TopSite {
  name: string;
  count: number;
  percent: number;
  barColor: string;
}

interface QuickAction {
  icon: 'site' | 'device' | 'sensor' | 'rule' | 'report' | 'map';
  label: string;
}

interface RecentEvent {
  time: string;
  title: string;
  location: string;
}

@Component({
  selector: 'app-equipment-dashboard',
  imports: [CommonModule, GenericPopup],
  templateUrl: './equipment-dashboard.html',
  styleUrl: './equipment-dashboard.css',
})
export class EquipmentDashboard {

  selectedWidget: WidgetDetail | null = null;

  openWidget(detail: WidgetDetail): void {
    this.selectedWidget = detail;
  }

  closeWidget(): void {
    this.selectedWidget = null;
  }

  alarmsSummaryDetail(): WidgetDetail {
    return {
      title: 'Alarms Summary',
      rows: this.alarmsSummary.map((s) => ({ label: s.label, value: `${s.value} (${s.percent}%)` })),
    };
  }

  sensorsByStatusDetail(): WidgetDetail {
    return {
      title: 'Sensors by Status',
      rows: this.sensorsByStatus.map((s) => ({ label: s.label, value: `${s.value} (${s.percent}%)` })),
    };
  }

  prioritySensorsDetail(): WidgetDetail {
    return {
      title: 'Priority Sensors',
      rows: this.prioritySensors.map((s) => ({ label: s.title, value: s.description })),
    };
  }

  envTilesDetail(): WidgetDetail {
    return {
      title: 'Environment Overview',
      rows: this.envTiles.map((t) => ({ label: t.label, value: `${t.value} (${t.status})` })),
    };
  }

  topSitesDetail(): WidgetDetail {
    return {
      title: 'Top Sites by Active Alarms',
      rows: this.topSites.map((s) => ({ label: s.name, value: `${s.count} alarms` })),
    };
  }

  quickActionsDetail(): WidgetDetail {
    return {
      title: 'Quick Actions',
      rows: this.quickActions.map((a) => ({ label: a.label, value: '' })),
    };
  }

  recentEventsDetail(): WidgetDetail {
    return {
      title: 'Recent Events',
      rows: this.recentEvents.map((e) => ({ label: e.title, value: `${e.location} - ${e.time}` })),
    };
  }

  statCards: StatCard[] = [
    { iconBg: 'bg-blue', icon: 'sites', color: '#3b82f6', label: 'Total Sites', value: '18', sub: '▲ 2 vs yesterday', subType: 'up' },
    { iconBg: 'bg-purple', icon: 'devices', color: '#7030a0', label: 'Total Devices', value: '245', sub: '▲ 8 vs yesterday', subType: 'up' },
    { iconBg: 'bg-green', icon: 'sensors', color: '#22c55e', label: 'Active Sensors', value: '1,256', sub: '▲ 32 vs yesterday', subType: 'up' },
    { iconBg: 'bg-red', icon: 'alarms', color: '#ef4444', label: 'Active Alarms', value: '12', sub: '▲ 3 vs yesterday', subType: 'up' },
    { iconBg: 'bg-blue', icon: 'compliance', color: '#3b82f6', label: 'Compliance Score', value: '92.6%', sub: '▲ 3.4% vs yesterday', subType: 'up' },
  ];

  alarmsSummary: DonutSlice[] = [
    { label: 'Critical', value: 7, percent: 58.3, color: '#ef4444' },
    { label: 'Major', value: 3, percent: 25, color: '#f97316' },
    { label: 'Minor', value: 2, percent: 16.7, color: '#eab308' },
    { label: 'Warning', value: 0, percent: 0, color: '#a78bfa' },
    { label: 'Info', value: 0, percent: 0, color: '#9ca3af' },
  ];

  sensorsByStatus: DonutSlice[] = [
    { label: 'Normal', value: 1102, percent: 87.7, color: '#22c55e' },
    { label: 'Warning', value: 92, percent: 7.3, color: '#f97316' },
    { label: 'Critical', value: 45, percent: 3.6, color: '#ef4444' },
    { label: 'Offline', value: 17, percent: 1.4, color: '#9ca3af' },
  ];

  trendLabels = ['15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May'];
  criticalPoints = '0,150 90,140 180,120 270,90 360,60 450,80 540,70';
  majorPoints = '0,180 90,175 180,178 270,172 360,168 450,174 540,170';
  minorPoints = '0,190 90,188 180,186 270,185 360,183 450,186 540,184';

  prioritySensors: PrioritySensor[] = [
    { icon: 'temp', iconBg: 'bg-red', color: '#ef4444', title: 'Temperature Sensor', description: 'Freezers, chillers, cold rooms, refrigerated displays' },
    { icon: 'humidity', iconBg: 'bg-orange', color: '#f97316', title: 'Temperature & Humidity Sensor', description: 'Cold rooms, food storage, fresh produce' },
    { icon: 'water', iconBg: 'bg-blue', color: '#3b82f6', title: 'Water Leak Sensor', description: 'Cold rooms, AHUs, refrigeration areas, kitchens, plant rooms' },
    { icon: 'energy', iconBg: 'bg-purple', color: '#7030a0', title: 'Energy / Smart Power Meter', description: 'Main DB, refrigeration, HVAC and major loads' },
    { icon: 'door', iconBg: 'bg-gray', color: '#6b7280', title: 'Cold-Room Door Sensor', description: 'Cold/freezer rooms, door-left-open detection' },
    { icon: 'refrigerant', iconBg: 'bg-blue', color: '#3b82f6', title: 'Refrigerant Gas Leak Sensor', description: 'Refrigeration plant and equipment rooms' },
    { icon: 'gas', iconBg: 'bg-orange', color: '#f97316', title: 'LPG / Natural Gas Leak Sensor', description: 'Kitchens, bakery and food-preparation areas' },
    { icon: 'co', iconBg: 'bg-red', color: '#ef4444', title: 'CO Sensor', description: 'Kitchens, loading areas, enclosed parking/plant areas' },
  ];

  envTiles: EnvTile[] = [
    { icon: 'temp', color: '#3b82f6', label: 'Temperature (Avg)', value: '3.2 °C', status: 'normal', points: '0,18 15,15 30,16 45,12 60,10 75,8' },
    { icon: 'humidity', color: '#3b82f6', label: 'Humidity (Avg)', value: '65.4 %RH', status: 'normal', points: '0,14 15,16 30,12 45,15 60,10 75,9' },
    { icon: 'energy', color: '#7030a0', label: 'Energy (Today)', value: '1,245 kWh', status: 'normal', points: '0,18 15,14 30,15 45,9 60,11 75,6' },
    { icon: 'water', color: '#ef4444', label: 'Water Leak', value: '2', status: 'critical', points: '0,10 15,12 30,8 45,14 60,9 75,16' },
    { icon: 'refrigerant', color: '#3b82f6', label: 'Refrigerant Leak', value: '0', status: 'normal', points: '0,15 15,15 30,15 45,15 60,15 75,15' },
    { icon: 'gas', color: '#ef4444', label: 'Gas Leak (LPG / Natural Gas)', value: '1', status: 'critical', points: '0,16 15,10 30,14 45,8 60,13 75,7' },
    { icon: 'co', color: '#3b82f6', label: 'CO Level (Avg)', value: '2.8 ppm', status: 'normal', points: '0,14 15,13 30,15 45,12 60,14 75,11' },
    { icon: 'door', color: '#ef4444', label: 'Door Open Alarms', value: '3', status: 'critical', points: '0,12 15,17 30,9 45,15 60,10 75,14' },
  ];

  topSites: TopSite[] = [
    { name: 'Central Kitchen', count: 5, percent: 100, barColor: '#ef4444' },
    { name: 'Cold Storage - A', count: 3, percent: 60, barColor: '#f97316' },
    { name: 'Retail Outlet - 12', count: 2, percent: 40, barColor: '#eab308' },
  ];

  quickActions: QuickAction[] = [
    { icon: 'site', label: 'Add Site' },
    { icon: 'device', label: 'Add Device' },
    { icon: 'sensor', label: 'Add Sensor' },
    { icon: 'rule', label: 'Create Alarm Rule' },
    { icon: 'report', label: 'View Reports' },
    { icon: 'map', label: 'Map View' },
  ];

  recentEvents: RecentEvent[] = [
    { time: '21 May 2025 10:24', title: 'Temperature High Alarm', location: 'Cold Room 01' },
    { time: '21 May 2025 10:21', title: 'Water Leak Detected', location: 'AHU Room' },
    { time: '21 May 2025 10:18', title: 'Door Left Open', location: 'Freezer Room 02' },
    { time: '21 May 2025 10:15', title: 'Gas Leak Detected', location: 'Kitchen - Main' },
  ];

  conicGradient(slices: DonutSlice[]): string {
    let acc = 0;
    const stops = slices.map((s) => {
      const start = acc;
      acc += s.percent;
      return `${s.color} ${start}% ${acc}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }

  totalOf(slices: DonutSlice[]): number {
    return slices.reduce((sum, s) => sum + s.value, 0);
  }

}

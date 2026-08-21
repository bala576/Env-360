import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GenericPopup } from '../../../shared/generic-popup/generic-popup';

interface WidgetDetail {
  title: string;
  rows?: { label: string; value: string }[];
  note?: string;
}

interface DonutSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
}

interface ViolationRow {
  outlet: string;
  area: string;
  location: string;
  temperature: number;
  humidity: number;
  violation: string;
  severity: 'critical' | 'major' | 'minor';
  updated: string;
}

interface MapPin {
  top: string;
  left: string;
  type: 'ok' | 'warning' | 'critical';
  label?: string;
}

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule, GenericPopup],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
})
export class MainDashboard {

  selectedWidget: WidgetDetail | null = null;

  openWidget(detail: WidgetDetail): void {
    this.selectedWidget = detail;
  }

  closeWidget(): void {
    this.selectedWidget = null;
  }

  mapDetail(): WidgetDetail {
    return {
      title: 'Outlet Status Map',
      rows: this.mapLegend.map((m) => ({ label: m.label, value: m.count + '' })),
    };
  }

  comfortDetail(): WidgetDetail {
    return {
      title: 'Comfort Index Distribution',
      rows: this.comfortDistribution.map((s) => ({ label: s.label, value: `${s.value} (${s.percent}%)` })),
    };
  }

  alarmsSeverityDetail(): WidgetDetail {
    return {
      title: 'Alarms by Severity',
      rows: this.alarmsBySeverity.map((s) => ({ label: s.label, value: `${s.value} (${s.percent}%)` })),
    };
  }

  violationsDetail(): WidgetDetail {
    return {
      title: 'Top Outlets with Violations',
      rows: this.violationRows.map((r) => ({ label: r.outlet, value: `${r.violation} - ${r.severity}` })),
    };
  }

   comfortDistribution: DonutSlice[] = [
    { label: 'Excellent (90-100)', value: 56, percent: 45, color: '#22c55e' },
    { label: 'Good (70-89)', value: 41, percent: 33, color: '#eab308' },
    { label: 'Fair (50-69)', value: 17, percent: 14, color: '#f97316' },
    { label: 'Poor (<50)', value: 10, percent: 8, color: '#ef4444' },
  ];

  alarmsBySeverity: DonutSlice[] = [
    { label: 'Critical', value: 5, percent: 42, color: '#ef4444' },
    { label: 'Major', value: 4, percent: 33, color: '#f97316' },
    { label: 'Minor', value: 3, percent: 25, color: '#eab308' },
  ];

  violationRows: ViolationRow[] = [
    { outlet: 'Outlet - 021', area: 'City Center', location: 'Dairy Section', temperature: 8.7, humidity: 72, violation: 'High Temp, High Humidity', severity: 'critical', updated: '21 May 2025 10:24' },
    { outlet: 'Outlet - 057', area: 'Green Mall', location: 'Vegetable Section', temperature: 1.0, humidity: 68, violation: 'Low Temp, High Humidity', severity: 'major', updated: '21 May 2025 10:18' },
    { outlet: 'Outlet - 014', area: 'Mega Mart', location: 'Ice Cream Freezer', temperature: -1.2, humidity: 45, violation: 'Low Temp', severity: 'major', updated: '21 May 2025 10:15' },
    { outlet: 'Outlet - 089', area: 'Town Plaza', location: 'Bakery', temperature: 7.3, humidity: 38, violation: 'High Temp', severity: 'minor', updated: '21 May 2025 10:10' },
    { outlet: 'Outlet - 033', area: 'Sunshine', location: 'Cold Room', temperature: 0.5, humidity: 70, violation: 'Low Temp, High Humidity', severity: 'major', updated: '21 May 2025 10:05' },
  ];

  mapPins: MapPin[] = [
    { top: '14%', left: '44%', type: 'critical' },
    { top: '20%', left: '64%', type: 'ok' },
    { top: '24%', left: '20%', type: 'ok' },
    { top: '34%', left: '82%', type: 'critical' },
    { top: '38%', left: '52%', type: 'warning', label: '5' },
    { top: '46%', left: '30%', type: 'warning', label: '8' },
    { top: '52%', left: '70%', type: 'ok' },
    { top: '60%', left: '46%', type: 'warning', label: '6' },
    { top: '66%', left: '62%', type: 'ok' },
    { top: '70%', left: '26%', type: 'warning', label: '3' },
    { top: '76%', left: '56%', type: 'warning', label: '2' },
  ];

  mapLegend = [
    { label: 'Normal', count: 86, color: '#22c55e' },
    { label: 'Warning', count: 15, color: '#f97316' },
    { label: 'Critical', count: 5, color: '#ef4444' },
    { label: 'Offline', count: 12, color: '#9ca3af' },
  ];

  chartLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
  chartYLabels = [10, 7, 4, 1, -2];

  avgPoints = '0,47 93,60 187,40 280,53 373,64 467,37 560,49';
  minPoints = '0,120 93,125 187,117 280,120 373,124 467,119 560,120';
  maxPoints = '0,13 93,19 187,27 280,16 373,24 467,19 560,15';

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

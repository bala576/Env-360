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
  icon: 'manhole' | 'check' | 'warning' | 'critical' | 'offline' | 'overflow';
  color: string;
  label: string;
  value: string;
  percent?: string;
  sub?: string;
  subType?: 'up' | 'down' | 'neutral';
  link?: string;
}

interface ZoneBubble {
  top: string;
  left: string;
  size: number;
  count: number;
  type: 'normal' | 'warning' | 'critical';
}

interface ZoneLabel {
  top: string;
  left: string;
  label: string;
}

interface DonutSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
}

interface SensorRow {
  manholeId: string;
  location: string;
  sensorId: string;
  level: number;
  percentFull: number;
  status: 'normal' | 'warning' | 'critical';
  battery: number;
  updated: string;
}

interface AlarmItem {
  title: string;
  manholeId: string;
  location: string;
  time: string;
  severity: 'critical' | 'warning';
}

interface LevelRank {
  manholeId: string;
  location: string;
  level: number;
  percent: number;
  barColor: string;
}

interface IconStat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-manhole-dashboard',
  imports: [CommonModule, GenericPopup],
  templateUrl: './manhole-dashboard.html',
  styleUrl: './manhole-dashboard.css',
})
export class ManholeDashboard {

  selectedWidget: WidgetDetail | null = null;

  openWidget(detail: WidgetDetail): void {
    this.selectedWidget = detail;
  }

  closeWidget(): void {
    this.selectedWidget = null;
  }

  mapDetail(): WidgetDetail {
    return {
      title: 'Manhole Status Map',
      rows: this.mapLegend.map((m) => ({ label: m.label, value: m.count + '' })),
    };
  }

  sensorRowsDetail(): WidgetDetail {
    return {
      title: 'Level Sensors',
      rows: this.sensorRows.map((r) => ({ label: r.manholeId, value: `${r.level} m - ${r.status}` })),
    };
  }

  recentAlarmsDetail(): WidgetDetail {
    return {
      title: 'Recent Alarms',
      rows: this.recentAlarms.map((a) => ({ label: a.title, value: `${a.manholeId} - ${a.severity}` })),
    };
  }

  topLevelsDetail(): WidgetDetail {
    return {
      title: 'Top 5 Manholes by Level',
      rows: this.topLevels.map((m) => ({ label: m.manholeId, value: `${m.level} m (${m.percent}%)` })),
    };
  }

  overflowRiskDetail(): WidgetDetail {
    return {
      title: 'Overflow Risk (Next 6 Hours)',
      rows: this.overflowRisk.map((s) => ({ label: s.label, value: `${s.value} (${s.percent}%)` })),
    };
  }

  maintenanceDetail(): WidgetDetail {
    return {
      title: 'Maintenance Summary',
      rows: this.maintenanceStats.map((s) => ({ label: s.label, value: s.value })),
    };
  }

  rainfallDetail(): WidgetDetail {
    return {
      title: 'Rainfall',
      rows: this.rainfallStats.map((s) => ({ label: s.label, value: s.value })),
    };
  }

  statCards: StatCard[] = [
    { iconBg: 'bg-blue', icon: 'manhole', color: '#3b82f6', label: 'Total Manholes', value: '512', sub: '▲ 6 vs yesterday', subType: 'up' },
    { iconBg: 'bg-green', icon: 'check', color: '#22c55e', label: 'Normal', value: '386', percent: '(75.4%)', sub: '▲ 8 vs yesterday', subType: 'up' },
    { iconBg: 'bg-orange', icon: 'warning', color: '#f97316', label: 'Warning', value: '78', percent: '(15.2%)', sub: '▼ 2 vs yesterday', subType: 'down' },
    { iconBg: 'bg-red', icon: 'critical', color: '#ef4444', label: 'Critical', value: '27', percent: '(5.3%)', sub: '▲ 3 vs yesterday', subType: 'up' },
    { iconBg: 'bg-gray', icon: 'offline', color: '#6b7280', label: 'Offline', value: '21', percent: '(4.1%)', sub: '▼ 4 vs yesterday', subType: 'down' },
    { iconBg: 'bg-purple', icon: 'overflow', color: '#7030a0', label: 'Predicted Overflow (Next 6h)', value: '7', link: 'View Predictions →' },
  ];

  zoneBubbles: ZoneBubble[] = [
    { top: '10%', left: '10%', size: 26, count: 3, type: 'normal' },
    { top: '18%', left: '30%', size: 30, count: 4, type: 'normal' },
    { top: '12%', left: '52%', size: 34, count: 5, type: 'critical' },
    { top: '20%', left: '70%', size: 28, count: 3, type: 'normal' },
    { top: '34%', left: '18%', size: 26, count: 3, type: 'normal' },
    { top: '40%', left: '40%', size: 32, count: 4, type: 'warning' },
    { top: '38%', left: '58%', size: 46, count: 12, type: 'critical' },
    { top: '32%', left: '78%', size: 28, count: 2, type: 'warning' },
    { top: '54%', left: '10%', size: 26, count: 3, type: 'normal' },
    { top: '58%', left: '32%', size: 28, count: 6, type: 'normal' },
    { top: '56%', left: '52%', size: 24, count: 2, type: 'normal' },
    { top: '52%', left: '70%', size: 26, count: 4, type: 'normal' },
    { top: '72%', left: '20%', size: 24, count: 2, type: 'normal' },
    { top: '76%', left: '46%', size: 24, count: 4, type: 'normal' },
  ];

  zoneLabels: ZoneLabel[] = [
    { top: '6%', left: '26%', label: 'North Zone' },
    { top: '30%', left: '46%', label: 'Central Zone' },
    { top: '10%', left: '82%', label: 'East Zone' },
    { top: '48%', left: '6%', label: 'West Zone' },
    { top: '80%', left: '58%', label: 'Riverside' },
  ];

  mapLegend = [
    { label: 'Normal', count: 386, color: '#22c55e' },
    { label: 'Warning', count: 78, color: '#f97316' },
    { label: 'Critical', count: 27, color: '#ef4444' },
    { label: 'Offline', count: 21, color: '#6b7280' },
  ];

  selectedManhole = 'MH-0245';

  waterChartLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
  waterLevelPoints = '0,178 93,158 187,124 280,94 373,108 467,146 560,166';
  rainfallBars = [0, 8, 42, 28, 12, 4, 0];
  warningLevelY = 56;
  criticalLevelY = 24;

  currentLevel = 1.32;
  percentFull = 66;
  predicted1h = 1.68;
  predicted6h = 2.05;

  predictionLabels = ['Now', '+1h', '+2h', '+3h', '+4h', '+5h', '+6h'];
  observedPoints = '0,94 93,76';
  predictedPoints = '93,76 187,58 280,44 373,32 467,36 560,48';
  overflowProbability = 72;
  expectedTimeHours = 2.5;
  expectedTimeLabel = 'Today 15:30';

  sensorRows: SensorRow[] = [
    { manholeId: 'MH-0245', location: 'Main St / 5th Ave', sensorId: 'LS-0245', level: 1.32, percentFull: 66, status: 'warning', battery: 78, updated: '21 May 2025 10:24' },
    { manholeId: 'MH-0187', location: 'Park Road / 2nd St', sensorId: 'LS-0187', level: 0.58, percentFull: 29, status: 'normal', battery: 92, updated: '21 May 2025 10:23' },
    { manholeId: 'MH-0332', location: 'Hill View / 7th Ave', sensorId: 'LS-0332', level: 2.08, percentFull: 87, status: 'critical', battery: 65, updated: '21 May 2025 10:23' },
    { manholeId: 'MH-0099', location: 'Lake Side / 3rd St', sensorId: 'LS-0099', level: 0.42, percentFull: 21, status: 'normal', battery: 88, updated: '21 May 2025 10:22' },
    { manholeId: 'MH-0410', location: 'Bridge Rd / 6th Ave', sensorId: 'LS-0410', level: 1.75, percentFull: 73, status: 'warning', battery: 71, updated: '21 May 2025 10:22' },
  ];

  recentAlarms: AlarmItem[] = [
    { title: 'High Water Level', manholeId: 'MH-0332', location: 'Hill View / 7th Ave', time: '10:23', severity: 'critical' },
    { title: 'Level Rising Fast', manholeId: 'MH-0245', location: 'Main St / 5th Ave', time: '10:21', severity: 'warning' },
    { title: 'Battery Low', manholeId: 'MH-0288', location: 'River Side / 1st St', time: '10:18', severity: 'warning' },
    { title: 'Predicted Overflow', manholeId: 'MH-0441', location: 'College Rd / 9th Ave', time: '10:10', severity: 'critical' },
  ];

  topLevels: LevelRank[] = [
    { manholeId: 'MH-0332', location: 'Hill View / 7th Ave', level: 2.08, percent: 87, barColor: '#ef4444' },
    { manholeId: 'MH-0411', location: 'Old Bridge / 4th St', level: 1.92, percent: 81, barColor: '#f97316' },
    { manholeId: 'MH-0245', location: 'Main St / 5th Ave', level: 1.32, percent: 66, barColor: '#f97316' },
    { manholeId: 'MH-0187', location: 'Park Road / 2nd St', level: 0.58, percent: 29, barColor: '#22c55e' },
    { manholeId: 'MH-0099', location: 'Lake Side / 3rd St', level: 0.42, percent: 21, barColor: '#22c55e' },
  ];

  overflowRisk: DonutSlice[] = [
    { label: 'High Risk', value: 7, percent: 9.2, color: '#ef4444' },
    { label: 'Medium Risk', value: 18, percent: 23.7, color: '#f97316' },
    { label: 'Low Risk', value: 45, percent: 59.2, color: '#22c55e' },
    { label: 'No Risk', value: 6, percent: 7.9, color: '#9ca3af' },
  ];

  maintenanceStats: IconStat[] = [
    { label: 'Open Work Orders', value: '12' },
    { label: 'Due This Week', value: '5' },
  ];

  rainfallStats: IconStat[] = [
    { label: 'Today', value: '24.8 mm' },
    { label: 'Last 24 Hours', value: '38.6 mm' },
    { label: 'Forecast (6h)', value: '18.2 mm' },
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

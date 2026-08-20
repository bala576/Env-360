import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Otp } from './features/auth/otp/otp';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { MainDashboard } from './features/dashboard/main-dashboard/main-dashboard';
import { ManholeDashboard } from './features/dashboard/manhole-dashboard/manhole-dashboard';
import { EquipmentDashboard } from './features/dashboard/equipment-dashboard/equipment-dashboard';
import { User } from './features/user-management/user/user';
import { Role } from './features/user-management/role/role';
import { CreateRole } from './features/user-management/role/create-role/create-role';
import { Events } from './features/Events/events/events';
import { LiveMap } from './features/locating/live-map/live-map';
import { ProcessAndAutomation } from './features/process-and- automation/process-and-automation/process-and-automation';
import { CreateProcessAutomation } from './features/process-and- automation/create-process-automation/create-process-automation';
import { ReportList } from './features/reports/report-list/report-list';
import { GenerateReport } from './features/reports/generate-report/generate-report';

import { Device } from './features/configuration/device/device';
import { DeviceDetails } from './features/configuration/device/device-details/device-details';
import { Project } from './features/configuration/project/project';

import { CalculatedParameter } from './features/configuration/masters/environment-master/calculated-parameter/calculated-parameter';
import { Categories } from './features/configuration/masters/environment-master/categories/categories';
import { ComplianceStandard } from './features/configuration/masters/environment-master/compliance-standard/compliance-standard';
import { ParameterGroups } from './features/configuration/masters/environment-master/parameter-groups/parameter-groups';
import { Types } from './features/configuration/masters/environment-master/types/types';

import { Document } from './features/configuration/masters/general-master/document/document';
import { Location } from './features/configuration/masters/general-master/location/location';
import { Monitor } from './features/configuration/masters/general-master/monitor/monitor';
import { Organization } from './features/configuration/masters/general-master/organization/organization';
import { Parameter } from './features/configuration/masters/general-master/parameter/parameter';
import { Severity } from './features/configuration/masters/general-master/severity/severity';
import { Status } from './features/configuration/masters/general-master/status/status';
import { Unit } from './features/configuration/masters/general-master/unit/unit';

import { AlarmTypes } from './features/configuration/masters/monitoring-master/alarm-types/alarm-types';
import { DataCollectionProfile } from './features/configuration/masters/monitoring-master/data-collection-profile/data-collection-profile';
import { DataQualityProfile } from './features/configuration/masters/monitoring-master/data-quality-profile/data-quality-profile';
import { MaintenanceProfile } from './features/configuration/masters/monitoring-master/maintenance-profile/maintenance-profile';
import { NotificationProfile } from './features/configuration/masters/monitoring-master/notification-profile/notification-profile';
import { ThresholdProfile } from './features/configuration/masters/monitoring-master/threshold-profile/threshold-profile';

import { ConnectivityProfile } from './features/configuration/masters/sensor-master/connectivity-profile/connectivity-profile';
import { DeviceModel } from './features/configuration/masters/sensor-master/device-model/device-model';
import { DeviceProfile } from './features/configuration/masters/sensor-master/device-profile/device-profile';
import { Manufacture } from './features/configuration/masters/sensor-master/manufacture/manufacture';
import { PayloadMapping } from './features/configuration/masters/sensor-master/payload-mapping/payload-mapping';
import { SensorTypes } from './features/configuration/masters/sensor-master/sensor-types/sensor-types';
import { LicenceManagement } from './features/configuration/licence-management/licence-management';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'otp', component: Otp },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: MainDashboard },
      { path: 'manhole-dashboard', component: ManholeDashboard },
      { path: 'equipment-dashboard', component: EquipmentDashboard },
      { path: 'locating', component: LiveMap },
      { path: 'events', component: Events },
      { path: 'report-list', component: ReportList },
      { path: 'report/generate', component: GenerateReport },
      { path: 'process-automation', component: ProcessAndAutomation },
      { path: 'process-automation/create', component: CreateProcessAutomation },
      { path: 'user', component: User },
      { path: 'role', component: Role },
      { path: 'role/create', component: CreateRole },
      { path: 'role/:roleId/edit', component: CreateRole },
      { path: 'licence-management', component: LicenceManagement },

      { path: 'administration/configuration/devices', component: Device },
      { path: 'administration/configuration/devices/:deviceId', component: DeviceDetails },
      { path: 'administration/configuration/project', component: Project },

      { path: 'administration/configuration/masters/environment-master/calculated-parameter', component: CalculatedParameter },
      { path: 'administration/configuration/masters/environment-master/categories', component: Categories },
      { path: 'administration/configuration/masters/environment-master/compliance-standard', component: ComplianceStandard },
      { path: 'administration/configuration/masters/environment-master/parameter-groups', component: ParameterGroups },
      { path: 'administration/configuration/masters/environment-master/types', component: Types },

      { path: 'administration/configuration/masters/general-master/document', component: Document },
      { path: 'administration/configuration/masters/general-master/location', component: Location },
      { path: 'administration/configuration/masters/general-master/monitor', component: Monitor },
      { path: 'administration/configuration/masters/general-master/organization', component: Organization },
      { path: 'administration/configuration/masters/general-master/parameter', component: Parameter },
      { path: 'administration/configuration/masters/general-master/severity', component: Severity },
      { path: 'administration/configuration/masters/general-master/status', component: Status },
      { path: 'administration/configuration/masters/general-master/unit', component: Unit },

      { path: 'administration/configuration/masters/monitoring-master/alarm-types', component: AlarmTypes },
      { path: 'administration/configuration/masters/monitoring-master/data-collection-profile', component: DataCollectionProfile },
      { path: 'administration/configuration/masters/monitoring-master/data-quality-profile', component: DataQualityProfile },
      { path: 'administration/configuration/masters/monitoring-master/maintenance-profile', component: MaintenanceProfile },
      { path: 'administration/configuration/masters/monitoring-master/notification-profile', component: NotificationProfile },
      { path: 'administration/configuration/masters/monitoring-master/threshold-profile', component: ThresholdProfile },

      { path: 'administration/configuration/masters/sensor-master/connectivity-profile', component: ConnectivityProfile },
      { path: 'administration/configuration/masters/sensor-master/device-model', component: DeviceModel },
      { path: 'administration/configuration/masters/sensor-master/device-profile', component: DeviceProfile },
      { path: 'administration/configuration/masters/sensor-master/manufacture', component: Manufacture },
      { path: 'administration/configuration/masters/sensor-master/payload-mapping', component: PayloadMapping },
      { path: 'administration/configuration/masters/sensor-master/sensor-types', component: SensorTypes }
    ],
  },
  { path: '**', redirectTo: 'login' },
];

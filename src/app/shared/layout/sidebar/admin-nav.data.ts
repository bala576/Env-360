export interface AdminSubItem {
  label: string;
  route?: string;
  addIcon?: boolean;
  children?: AdminSubItem[];
}

export interface AdminSection {
  label: string;
  icon: 'config' | 'users' | 'licence';
  route?: string;
  children?: AdminSubItem[];
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    label: 'Configuration',
    icon: 'config',
    children: [
      { label: 'Devices', route: '/administration/configuration/devices' },
      { label: 'Project', route: '/administration/configuration/project' },
      {
        label: 'Environment Master',
        children: [
          { label: 'Calculated Parameter', route: '/administration/configuration/masters/environment-master/calculated-parameter' },
          { label: 'Categories', route: '/administration/configuration/masters/environment-master/categories' },
          { label: 'Compliance Standard', route: '/administration/configuration/masters/environment-master/compliance-standard' },
          { label: 'Parameter Groups', route: '/administration/configuration/masters/environment-master/parameter-groups' },
          { label: 'Types', route: '/administration/configuration/masters/environment-master/types' }
        ]
      },
      {
        label: 'General Master',
        children: [
          { label: 'Document', route: '/administration/configuration/masters/general-master/document' },
          { label: 'Location', route: '/administration/configuration/masters/general-master/location' },
          { label: 'Monitor', route: '/administration/configuration/masters/general-master/monitor' },
          { label: 'Organization', route: '/administration/configuration/masters/general-master/organization' },
          { label: 'Parameter', route: '/administration/configuration/masters/general-master/parameter' },
          { label: 'Severity', route: '/administration/configuration/masters/general-master/severity' },
          { label: 'Status', route: '/administration/configuration/masters/general-master/status' },
          { label: 'Unit', route: '/administration/configuration/masters/general-master/unit' }
        ]
      },
      {
        label: 'Monitoring Master',
        children: [
          { label: 'Alarm Types', route: '/administration/configuration/masters/monitoring-master/alarm-types' },
          { label: 'Data Collection Profile', route: '/administration/configuration/masters/monitoring-master/data-collection-profile' },
          { label: 'Data Quality Profile', route: '/administration/configuration/masters/monitoring-master/data-quality-profile' },
          { label: 'Maintenance Profile', route: '/administration/configuration/masters/monitoring-master/maintenance-profile' },
          { label: 'Notification Profile', route: '/administration/configuration/masters/monitoring-master/notification-profile' },
          { label: 'Threshold Profile', route: '/administration/configuration/masters/monitoring-master/threshold-profile' }
        ]
      },
      {
        label: 'Sensor Master',
        children: [
          { label: 'Connectivity Profile', route: '/administration/configuration/masters/sensor-master/connectivity-profile' },
          { label: 'Device Model', route: '/administration/configuration/masters/sensor-master/device-model' },
          { label: 'Device Profile', route: '/administration/configuration/masters/sensor-master/device-profile' },
          { label: 'Manufacture', route: '/administration/configuration/masters/sensor-master/manufacture' },
          { label: 'Payload Mapping', route: '/administration/configuration/masters/sensor-master/payload-mapping' },
          { label: 'Sensor Types', route: '/administration/configuration/masters/sensor-master/sensor-types' }
        ]
      }
    ]
  },
  {
    label: 'User Management',
    icon: 'users',
    children: [
      { label: 'Role', route: '/role' },
      { label: 'User', route: '/user' }
    ]
  },
  {
    label: 'Licence Management',
    icon: 'licence',
    route: '/licence-management'
  }
];

export function firstRoute(node: AdminSection | AdminSubItem): string | undefined {
  if (node.route) return node.route;
  return node.children?.map(firstRoute).find((route): route is string => !!route);
}

export interface BreadcrumbDropdownItem {
  label: string;
  route: string;
}

export const ADMIN_TOP_DROPDOWN: BreadcrumbDropdownItem[] = ADMIN_SECTIONS
  .map(section => ({ label: section.label, route: firstRoute(section) }))
  .filter((item): item is BreadcrumbDropdownItem => !!item.route);

export const CONFIGURATION_DROPDOWN: BreadcrumbDropdownItem[] = (ADMIN_SECTIONS[0].children ?? [])
  .map(child => ({ label: child.label, route: firstRoute(child) }))
  .filter((item): item is BreadcrumbDropdownItem => !!item.route);

export const USER_MANAGEMENT_DROPDOWN: BreadcrumbDropdownItem[] = (ADMIN_SECTIONS[1].children ?? [])
  .map(child => ({ label: child.label, route: firstRoute(child) }))
  .filter((item): item is BreadcrumbDropdownItem => !!item.route);

function dropdownForGroup(label: string): BreadcrumbDropdownItem[] {
  const group = (ADMIN_SECTIONS[0].children ?? []).find(child => child.label === label);
  return (group?.children ?? [])
    .map(child => ({ label: child.label, route: child.route }))
    .filter((item): item is BreadcrumbDropdownItem => !!item.route);
}

export const ENVIRONMENT_MASTER_DROPDOWN = dropdownForGroup('Environment Master');
export const GENERAL_MASTER_DROPDOWN = dropdownForGroup('General Master');
export const MONITORING_MASTER_DROPDOWN = dropdownForGroup('Monitoring Master');
export const SENSOR_MASTER_DROPDOWN = dropdownForGroup('Sensor Master');

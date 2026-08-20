export const PARAMETER_UNITS: Record<string, string> = {
  'Temperature': '°C',
  'Humidity': '%RH',
  'Carbon Dioxide': 'ppm',
  'H2S': 'ppm',
  'pH': 'pH',
  'Water Level': 'm',
  'Battery Level': '%',
  'Signal Strength': 'dBm',
  'Noise': 'dB',
};

export const PARAMETER_OPTIONS = Object.keys(PARAMETER_UNITS);

export const THRESHOLD_PROFILE_BY_PARAMETER: Record<string, string> = {
  'Temperature': 'Temperature Threshold',
  'Humidity': 'Humidity Threshold',
  'Carbon Dioxide': 'CO2 Threshold',
  'H2S': 'H2S Gas Threshold',
  'pH': 'Water pH Threshold',
};

export const DATA_QUALITY_PROFILE_BY_PARAMETER: Record<string, string> = {
  'Temperature': 'Temperature Data Quality',
  'Humidity': 'Humidity Data Quality',
  'Carbon Dioxide': 'CO2 Data Quality',
  'H2S': 'Gas Sensor Data Quality',
  'pH': 'Water Quality Data Quality',
};

export const THRESHOLD_PROFILE_OPTIONS = [
  'Temperature Threshold',
  'Humidity Threshold',
  'CO2 Threshold',
  'H2S Gas Threshold',
  'Water pH Threshold',
];

export const DATA_COLLECTION_PROFILE_OPTIONS = [
  'High Frequency Indoor Sensors',
  'Low Power Outdoor Sensors',
  'Critical Gas Monitoring',
  'Cold Chain Monitoring',
  'Weather Station Batch Reporting',
];

export const DATA_QUALITY_PROFILE_OPTIONS = [
  'Temperature Data Quality',
  'Humidity Data Quality',
  'CO2 Data Quality',
  'Gas Sensor Data Quality',
  'Water Quality Data Quality',
];

export const DEVICE_MODEL_OPTIONS = [
  'ClimaTech CT-100',
  'GasGuard GG-H2S-200',
  'AquaMetrics AM-PH-50',
  'SenTech ST-CO2-300',
  'EnviroSense ES-Multi-400',
];

export const CONNECTIVITY_OPTIONS = ['LoRaWAN', 'NB-IoT', 'WiFi', 'Cellular (4G/5G)', 'Ethernet'];

export const HEALTH_STATUS_OPTIONS = ['Healthy', 'Warning', 'Critical', 'Offline'];

export const DEVICE_PROFILE_OPTIONS = [
  'Indoor Air Quality Profile',
  'Confined Space Gas Profile',
  'Water Quality Profile',
  'Weather Station Profile',
  'Cold Chain Storage Profile',
];

export const DEVICE_MODEL_SUPPORTED_PARAMETERS: Record<string, string[]> = {
  'ClimaTech CT-100': ['Temperature', 'Humidity'],
  'GasGuard GG-H2S-200': ['H2S'],
  'AquaMetrics AM-PH-50': ['pH', 'Temperature'],
  'SenTech ST-CO2-300': ['Carbon Dioxide', 'Temperature', 'Humidity'],
  'EnviroSense ES-Multi-400': ['Temperature', 'Humidity', 'Carbon Dioxide', 'Noise'],
};

export const DEVICE_PROFILE_BY_MODEL: Record<string, string> = {
  'ClimaTech CT-100': 'Indoor Air Quality Profile',
  'GasGuard GG-H2S-200': 'Confined Space Gas Profile',
  'AquaMetrics AM-PH-50': 'Water Quality Profile',
  'SenTech ST-CO2-300': 'Weather Station Profile',
  'EnviroSense ES-Multi-400': 'Cold Chain Storage Profile',
};

export const MANUFACTURER_BY_MODEL: Record<string, string> = {
  'ClimaTech CT-100': 'ClimaTech Devices',
  'GasGuard GG-H2S-200': 'GasGuard Systems',
  'AquaMetrics AM-PH-50': 'AquaMetrics Ltd',
  'SenTech ST-CO2-300': 'SenTech Industries',
  'EnviroSense ES-Multi-400': 'EnviroSense Corp',
};

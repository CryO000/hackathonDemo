export interface SensorReading {
  nutrient: string;
  sensorId: string;
  current: number;
  target: number;
  status: string;
}

export interface SoilData {
  id: string;
  location: string;
  moisture: number; // Percentage
  surfaceMoisture: number; // Top layer
  rootZoneMoisture: number; // Deeper layer
  temperature: number; // Celsius
  nitrogen: number; // ppm
  phosphorus: number; // ppm
  potassium: number; // ppm
  ph: number;
  freezeState: string;
  sensorReadings: SensorReading[];
  lastUpdated: string;
}

export const mockSoilData: SoilData[] = [
  {
    id: 'field-1',
    location: 'North Sector',
    moisture: 45,
    surfaceMoisture: 48,
    rootZoneMoisture: 39,
    temperature: 22.5,
    nitrogen: 120,
    phosphorus: 45,
    potassium: 150,
    ph: 6.5,
    freezeState: 'Thawing',
    sensorReadings: [
      { nutrient: 'Nitrogen', sensorId: 'N-01', current: 120, target: 150, status: 'Active' },
      { nutrient: 'Phosphorus', sensorId: 'P-02', current: 45, target: 100, status: 'Active' },
      { nutrient: 'Potassium', sensorId: 'K-03', current: 150, target: 160, status: 'Ready' },
      { nutrient: 'Magnesium', sensorId: 'MG-04', current: 92, target: 100, status: 'Active' },
      { nutrient: 'Calcium', sensorId: 'CA-05', current: 98, target: 110, status: 'Active' },
      { nutrient: 'Sulfur', sensorId: 'S-06', current: 73, target: 90, status: 'Active' },
    ],
    lastUpdated: '2023-10-27T10:00:00Z',
  },
  {
    id: 'field-2',
    location: 'East Sector',
    moisture: 38,
    surfaceMoisture: 41,
    rootZoneMoisture: 33,
    temperature: 24.1,
    nitrogen: 110,
    phosphorus: 40,
    potassium: 140,
    ph: 6.8,
    freezeState: 'Normal',
    sensorReadings: [
      { nutrient: 'Nitrogen', sensorId: 'N-01', current: 110, target: 150, status: 'Active' },
      { nutrient: 'Phosphorus', sensorId: 'P-02', current: 40, target: 100, status: 'Active' },
      { nutrient: 'Potassium', sensorId: 'K-03', current: 140, target: 160, status: 'Active' },
      { nutrient: 'Magnesium', sensorId: 'MG-04', current: 88, target: 100, status: 'Active' },
      { nutrient: 'Calcium', sensorId: 'CA-05', current: 95, target: 110, status: 'Active' },
      { nutrient: 'Sulfur', sensorId: 'S-06', current: 70, target: 90, status: 'Active' },
    ],
    lastUpdated: '2023-10-27T10:15:00Z',
  },
  {
    id: 'field-3',
    location: 'South Sector',
    moisture: 52,
    surfaceMoisture: 56,
    rootZoneMoisture: 48,
    temperature: 21.8,
    nitrogen: 130,
    phosphorus: 50,
    potassium: 160,
    ph: 6.2,
    freezeState: 'Frozen',
    sensorReadings: [
      { nutrient: 'Nitrogen', sensorId: 'N-01', current: 130, target: 150, status: 'Active' },
      { nutrient: 'Phosphorus', sensorId: 'P-02', current: 50, target: 100, status: 'Active' },
      { nutrient: 'Potassium', sensorId: 'K-03', current: 160, target: 160, status: 'Ready' },
      { nutrient: 'Magnesium', sensorId: 'MG-04', current: 96, target: 100, status: 'Active' },
      { nutrient: 'Calcium', sensorId: 'CA-05', current: 102, target: 110, status: 'Active' },
      { nutrient: 'Sulfur', sensorId: 'S-06', current: 78, target: 90, status: 'Active' },
    ],
    lastUpdated: '2023-10-27T10:30:00Z',
  },
];

export const suggestionMessages = [
  {
    id: 1,
    user: 'Dr. Sarah Miller',
    role: 'Agronomist',
    message: 'The moisture levels in the North Sector are optimal for corn planting next week.',
    timestamp: '2 hours ago',
    avatar: 'SM'
  },
  {
    id: 2,
    user: 'James Chen',
    role: 'Farmer',
    message: 'Noticed some yellowing in the East Sector. Could be nitrogen deficiency despite the sensor readings.',
    timestamp: '4 hours ago',
    avatar: 'JC'
  },
  {
    id: 3,
    user: 'System Bot',
    role: 'AI Assistant',
    message: 'ALERT: Sentinel-1 data indicates a 15% drop in surface moisture in South Sector over the last 24 hours.',
    timestamp: '10 mins ago',
    avatar: 'AI'
  }
];

export const researchArticles = [
  {
    id: 1,
    title: 'Sentinel-1 for Soil Moisture Retrieval',
    summary: 'Using Synthetic Aperture Radar (SAR) to estimate soil moisture content regardless of cloud cover.',
    date: 'Oct 2023',
    author: 'Copernicus Land Monitoring Service'
  },
  {
    id: 2,
    title: 'Optimizing Nitrogen Application',
    summary: 'Reducing environmental impact while maximizing yield through precision agriculture techniques.',
    date: 'Sep 2023',
    author: 'Global Agriculture Research'
  },
  {
    id: 3,
    title: 'Climate Change Impact on Crop Cycles',
    summary: 'Analyzing 10-year trends in temperature and humidity shifts across European farmlands.',
    date: 'Aug 2023',
    author: 'European Space Agency'
  }
];

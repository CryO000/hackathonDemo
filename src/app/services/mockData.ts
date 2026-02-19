import { LucideIcon, Droplets, Thermometer, Wind, Sun, Activity, Sprout } from 'lucide-react';

export interface SoilData {
  id: string;
  location: string;
  moisture: number; // Percentage
  temperature: number; // Celsius
  nitrogen: number; // ppm
  phosphorus: number; // ppm
  potassium: number; // ppm
  ph: number;
  lastUpdated: string;
}

export const mockSoilData: SoilData[] = [
  {
    id: 'field-1',
    location: 'North Sector',
    moisture: 45,
    temperature: 22.5,
    nitrogen: 120,
    phosphorus: 45,
    potassium: 150,
    ph: 6.5,
    lastUpdated: '2023-10-27T10:00:00Z',
  },
  {
    id: 'field-2',
    location: 'East Sector',
    moisture: 38,
    temperature: 24.1,
    nitrogen: 110,
    phosphorus: 40,
    potassium: 140,
    ph: 6.8,
    lastUpdated: '2023-10-27T10:15:00Z',
  },
  {
    id: 'field-3',
    location: 'South Sector',
    moisture: 52,
    temperature: 21.8,
    nitrogen: 130,
    phosphorus: 50,
    potassium: 160,
    ph: 6.2,
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

export interface Farm {
  id: number;
  name: string;
  location?: string | null;
  description?: string | null;
}

export interface Field {
  id: number;
  farm_id: number;
  name: string;
  area_hectares?: number | null;
  boundary_geojson?: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  } | null;
}

export interface Sensor {
  id: number;
  field_id: number;
  sensor_code: string;
  sensor_type: string;
  unit: string;
  target_value?: number | null;
  is_active: boolean;
}

export interface SensorReading {
  id: number;
  sensor_id: number;
  value: number;
  recorded_at: string;
}

export interface SoilDashboardItem {
  id: string;
  location: string;
  moisture: number;
  surfaceMoisture: number;
  rootZoneMoisture: number;
  temperature: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  freezeState: string;
  sensorReadings: Array<{
    nutrient: string;
    sensorId: string;
    current: number;
    target: number;
    unit: string;
    status: string;
  }>;
  lastUpdated: string | null;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"
).replace(/\\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API request failed (${response.status}): ${message}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const agricultureApi = {
  listFarms: () => request<Farm[]>("/farms"),
  getFarm: (farmId: number) => request<Farm>(`/farms/${farmId}`),
  createFarm: (farm: Omit<Farm, "id">) =>
    request<Farm>("/farms", { method: "POST", body: JSON.stringify(farm) }),

  listFields: (farmId?: number) =>
    request<Field[]>(`/fields${farmId ? `?farm_id=${farmId}` : ""}`),
  createField: (field: Omit<Field, "id">) =>
    request<Field>("/fields", { method: "POST", body: JSON.stringify(field) }),

  listSensors: (fieldId?: number) =>
    request<Sensor[]>(`/sensors${fieldId ? `?field_id=${fieldId}` : ""}`),
  createSensor: (sensor: Omit<Sensor, "id">) =>
    request<Sensor>("/sensors", { method: "POST", body: JSON.stringify(sensor) }),

  listReadings: (filters: {
    sensor_id?: number;
    start?: string;
    end?: string;
    limit?: number;
  } = {}) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) query.set(key, String(value));
    });
    const suffix = query.size ? `?${query.toString()}` : "";
    return request<SensorReading[]>(`/readings${suffix}`);
  },
  createReading: (reading: Omit<SensorReading, "id">) =>
    request<SensorReading>("/readings", {
      method: "POST",
      body: JSON.stringify(reading),
    }),

  getSoilDashboard: () => request<SoilDashboardItem[]>("/dashboard/soil"),
};

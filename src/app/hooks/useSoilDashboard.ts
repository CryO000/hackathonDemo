import { useEffect, useState } from "react";
import { agricultureApi, type SoilDashboardItem } from "../services/api";
import { mockSoilData, type SoilData } from "../services/mockData";

function toSoilData(item: SoilDashboardItem): SoilData {
  return {
    ...item,
    lastUpdated: item.lastUpdated ?? new Date().toISOString(),
    sensorReadings: item.sensorReadings.map(({ unit: _unit, ...reading }) => reading),
  };
}

/**
 * Fetch live data when the FastAPI backend has fields configured.
 * Keep the existing sample dataset visible if the API is unavailable or empty.
 */
export function useSoilDashboard() {
  const [soilData, setSoilData] = useState<SoilData[]>(mockSoilData);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    agricultureApi
      .getSoilDashboard()
      .then((items) => {
        if (cancelled || items.length === 0) return;
        setSoilData(items.map(toSoilData));
        setIsLive(true);
      })
      .catch(() => {
        // The dashboard remains usable with mock data while the backend is offline.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { soilData, isLive };
}

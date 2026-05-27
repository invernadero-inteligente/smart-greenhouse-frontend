import { useCallback, useEffect, useMemo, useState } from "react";
import { sensorService } from "../services/sensor.service";

export function useSensors({ zoneId = null, pollingMs = 30000 } = {}) {
	const [zones, setZones] = useState([]);
	const [sensors, setSensors] = useState([]);
	const [generatedAt, setGeneratedAt] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchSensors = useCallback(async () => {
		try {
			setLoading(true);
			const data = await sensorService.getLatestReadings(zoneId);
			setZones(Array.isArray(data?.zones) ? data.zones : []);
			setSensors(Array.isArray(data?.sensors) ? data.sensors : []);
			setGeneratedAt(data?.generatedAt ?? null);
			setError(null);
		} catch (err) {
			setError(err?.message ?? "No se pudieron cargar las lecturas de sensores");
		} finally {
			setLoading(false);
		}
	}, [zoneId]);

	useEffect(() => {
		fetchSensors();

		if (!pollingMs || pollingMs <= 0) {
			return undefined;
		}

		const interval = setInterval(fetchSensors, pollingMs);
		return () => clearInterval(interval);
	}, [fetchSensors, pollingMs]);

	const metrics = useMemo(() => {
		const online = sensors.filter((sensor) => sensor.online).length;
		const critical = sensors.filter((sensor) => sensor.status === "CRITICAL").length;
		const warning = sensors.filter((sensor) => sensor.status === "WARNING").length;
		const normal = sensors.filter((sensor) => sensor.status === "NORMAL").length;

		return {
			total: sensors.length,
			online,
			critical,
			warning,
			normal,
		};
	}, [sensors]);

	return {
		zones,
		sensors,
		generatedAt,
		loading,
		error,
		metrics,
		fetchSensors,
	};
}

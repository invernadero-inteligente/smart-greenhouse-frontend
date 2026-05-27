import { api } from "./api";
import { sensorMocks } from "../mocks/sensores.mock";

const FORCE_MOCK_SENSORS = (import.meta.env.VITE_USE_MOCK_SENSORS ?? "false") === "true";

function normalizeMockStatus(status) {
	if (status === "ALERTA") return "CRITICAL";
	if (status === "OK") return "NORMAL";
	return "UNKNOWN";
}

function toIsoSafe(value) {
	if (!value) return new Date().toISOString();
	return value;
}

function mapMockToLatestReadings(zoneId = null) {
	const filtered = zoneId
		? sensorMocks.filter((sensor) => String(sensor.zoneId ?? "") === String(zoneId))
		: sensorMocks;

	const zonesMap = new Map();

	filtered.forEach((sensor) => {
		const zoneName = sensor.zone ?? "Zona sin nombre";
		const mapKey = zoneName;

		if (!zonesMap.has(mapKey)) {
			zonesMap.set(mapKey, {
				zoneId: sensor.zoneId ?? null,
				zoneName,
				description: "Datos simulados",
				isActive: true,
				online: true,
				lastReadingAt: toIsoSafe(sensor.lastUpdated),
				readings: [],
			});
		}

		const zone = zonesMap.get(mapKey);
		zone.readings.push({
			variable: sensor.name,
			value: String(sensor.value),
			unit: sensor.unit,
			status: normalizeMockStatus(sensor.status),
			timestamp: toIsoSafe(sensor.lastUpdated),
			online: true,
			crop: sensor.crop ?? null,
			message: sensor.message ?? null,
		});
	});

	return {
		generatedAt: new Date().toISOString(),
		zones: Array.from(zonesMap.values()),
	};
}

function flattenSensors(latestReadings) {
	const zones = latestReadings?.zones ?? [];

	return zones.flatMap((zone) =>
		(zone.readings ?? []).map((reading, index) => ({
			id: `${zone.zoneId ?? zone.zoneName}-${reading.variable}-${index}`,
			zoneId: zone.zoneId,
			zoneName: zone.zoneName,
			zoneOnline: Boolean(zone.online),
			variable: reading.variable,
			value: reading.value,
			unit: reading.unit,
			status: reading.status,
			timestamp: reading.timestamp,
			online: Boolean(reading.online),
			crop: reading.crop ?? null,
			message: reading.message ?? null,
		}))
	);
}

export const sensorService = {
	async getLatestReadings(zoneId = null) {
		if (FORCE_MOCK_SENSORS) {
			const latest = mapMockToLatestReadings(zoneId);
			return {
				generatedAt: latest.generatedAt,
				zones: latest.zones,
				sensors: flattenSensors(latest),
			};
		}

		try {
			const params = new URLSearchParams();
			if (zoneId != null) {
				params.append("zoneId", zoneId);
			}

			const { data } = await api.get(`/api/readings/latest${params.toString() ? "?" + params.toString() : ""}`);
			const payload = data?.data ?? data;

			const latest = {
				generatedAt: payload?.generatedAt ?? new Date().toISOString(),
				zones: payload?.zones ?? [],
			};

			return {
				...latest,
				sensors: flattenSensors(latest),
			};
		} catch {
			const latest = mapMockToLatestReadings(zoneId);
			return {
				generatedAt: latest.generatedAt,
				zones: latest.zones,
				sensors: flattenSensors(latest),
			};
		}
	},
};

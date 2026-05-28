import { useState, useEffect, useCallback } from "react";
import { zoneService } from "../services/zone.service";
import { normalizeCreatedAt } from "../lib/utils";

export function useZones(isActive = null) {
const [zones, setZones] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const extractList = (response) => {
	if (Array.isArray(response)) return response;
	if (Array.isArray(response?.data)) return response.data;
	if (Array.isArray(response?.content)) return response.content;
	if (Array.isArray(response?.payload)) return response.payload;
	if (Array.isArray(response?.data?.data)) return response.data.data;
	if (Array.isArray(response?.data?.content)) return response.data.content;
	if (Array.isArray(response?.data?.payload)) return response.data.payload;
	return [];
};

const fetchZones = useCallback(async () => {
try {
setLoading(true);
const response = await zoneService.listZones(isActive);
const list = extractList(response);
const normalizedZones = list.map((item) => ({ ...item, createdAt: normalizeCreatedAt(item) }));
setZones(normalizedZones);
const missing = normalizedZones.filter((item) => !item.createdAt);
if (missing.length > 0) {
	console.log("[useZones] No se encontró createdAt en zonas. Sample:", normalizedZones.slice(0, 3));
	try {
		const details = await Promise.all(
			missing.map((item) => zoneService.getZoneById(item.id).catch(() => null))
		);
		console.log("[useZones] zone detail responses:", details);
		setZones((prev) =>
			prev.map((zone) => {
				const det = details.find((d) => d && d.id === zone.id);
				return det ? { ...zone, createdAt: normalizeCreatedAt(det) ?? zone.createdAt } : zone;
			})
		);
	} catch {
		// fallback silently
	}
}
setError(null);
} catch (err) {
setError(err.message || "Error del servidor");
} finally {
setLoading(false);
}
}, [isActive]);

useEffect(() => { fetchZones(); }, [fetchZones]);

const createZone = async (data) => {
try {
const response = await zoneService.createZone(data);
const zone = response?.data ?? response;
setZones(prev => [...prev, zone]);
return zone;
} catch (err) {
if (!err.response) {
const newZone = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
setZones(prev => [...prev, newZone]);
return newZone;
}
setError(err.message);
throw err;
}
};

const updateZone = async (id, data) => {
try {
if (id == null) {
console.error("updateZone: id de zona inválido", id);
throw new Error("ID de zona inválido");
}
const response = await zoneService.updateZone(id, data);
const zone = response?.data ?? response;
setZones(prev => prev.map(z => z.id === id ? zone : z));
return zone;
} catch (err) {
if (!err.response) {
const updated = { ...zones.find(z => z.id === id), ...data };
setZones(prev => prev.map(z => z.id === id ? updated : z));
return updated;
}
setError(err.message);
throw err;
}
};

const deleteZone = async (id) => {
try {
const response = await zoneService.deleteZone(id);
const zone = response?.data ?? response;
setZones(prev => prev.map(z => (z.id === id ? { ...z, ...(zone ?? {}), isActive: false } : z)));
} catch (err) {
if (!err.response) {
setZones(prev => prev.map(z => (z.id === id ? { ...z, isActive: false } : z)));
return;
}
setError(err.message);
throw err;
}
};

const restoreZone = async (id) => {
try {
const response = await zoneService.restoreZone(id);
const zone = response?.data ?? response;
setZones(prev => prev.map(z => (z.id === id ? { ...z, ...(zone ?? {}), isActive: true } : z)));
} catch (err) {
if (!err.response) {
setZones(prev => prev.map(z => (z.id === id ? { ...z, isActive: true } : z)));
return;
}
setError(err.message);
throw err;
}
};

return { zones, loading, error, fetchZones, createZone, updateZone, deleteZone, restoreZone };
}

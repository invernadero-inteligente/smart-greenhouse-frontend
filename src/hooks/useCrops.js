import { useState, useEffect, useCallback } from "react";
import { cropService } from "../services/crop.service";
import { normalizeCreatedAt } from "../lib/utils";

export function useCrops(status = null, zoneId = null) {
const [crops, setCrops] = useState([]);
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

const fetchCrops = useCallback(async () => {
try {
setLoading(true);
const response = await cropService.listCrops(status, zoneId);
// El endpoint /api/crops devuelve CropsDataResponseDTO con zona-grupos:
// { data: [{ zoneId, zoneName, info: [{id, name, ...}] }] }
// Aplanamos en un array de cultivos individuales
const raw = extractList(response);
let list;
if (raw.length > 0 && raw[0]?.info !== undefined) {
// Respuesta zona-agrupada: aplanamos
list = raw.flatMap((group) =>
	(group.info ?? []).map((crop) => ({
		...crop,
		zoneId: group.zoneId,
		zoneName: group.zoneName,
	}))
);
} else if (Array.isArray(raw)) {
	list = raw;
} else {
	list = [];
}
const normalizedCrops = list.map((item) => ({ ...item, createdAt: normalizeCreatedAt(item) }));
setCrops(normalizedCrops);
const missing = normalizedCrops.filter((item) => !item.createdAt);
if (missing.length > 0) {
	console.log("[useCrops] No se encontró createdAt en cultivos. Sample:", normalizedCrops.slice(0, 3));
	try {
		const details = await Promise.all(
			missing.map((item) => cropService.getCropById(item.id).catch(() => null))
		);
		console.log("[useCrops] crop detail responses:", details);
		setCrops((prev) =>
			prev.map((crop) => {
				const det = details.find((d) => d && d.id === crop.id);
				return det ? { ...crop, createdAt: normalizeCreatedAt(det) ?? crop.createdAt } : crop;
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
}, [status, zoneId]);

useEffect(() => { fetchCrops(); }, [fetchCrops]);

const createCrop = async (data) => {
try {
await cropService.createCrop(data);
// La respuesta de create solo tiene {name, status}, sin id.
// Re-fetch para obtener la lista actualizada con ids reales.
await fetchCrops();
} catch (err) {
if (!err.response) {
const newCrop = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
setCrops(prev => [...prev, newCrop]);
return newCrop;
}
setError(err.message);
throw err;
}
};

const updateCrop = async (id, data) => {
try {
await cropService.updateCrop(id, data);
// 204 No Content — re-fetch para actualizar lista con datos reales
await fetchCrops();
} catch (err) {
if (!err.response) {
const updated = { ...crops.find(c => c.id === id), ...data };
setCrops(prev => prev.map(c => c.id === id ? updated : c));
return updated;
}
setError(err.message);
throw err;
}
};

const deleteCrop = async (id) => {
try {
await cropService.deleteCrop(id);
setCrops(prev => prev.filter(c => c.id !== id));
} catch (err) {
if (!err.response) {
setCrops(prev => prev.filter(c => c.id !== id));
return;
}
setError(err.message);
throw err;
}
};

return { crops, loading, error, fetchCrops, createCrop, updateCrop, deleteCrop };
}

import { useState, useEffect, useCallback } from "react";
import { cropService } from "../services/crop.service";

export function useCrops(status = null, zoneId = null) {
const [crops, setCrops] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchCrops = useCallback(async () => {
try {
setLoading(true);
const response = await cropService.listCrops(status, zoneId);
// El endpoint /api/crops devuelve CropsDataResponseDTO con zona-grupos:
// { data: [{ zoneId, zoneName, info: [{id, name, ...}] }] }
// Aplanamos en un array de cultivos individuales
const raw = response?.data ?? response ?? [];
let list;
if (Array.isArray(raw) && raw.length > 0 && raw[0]?.info !== undefined) {
// Respuesta zona-agrupada: aplanamos
list = raw.flatMap(group =>
(group.info ?? []).map(crop => ({
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
setCrops(list);
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

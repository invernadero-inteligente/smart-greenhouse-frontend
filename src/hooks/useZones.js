import { useState, useEffect, useCallback } from "react";
import { zoneService } from "../services/zone.service";

export function useZones(isActive = null) {
const [zones, setZones] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchZones = useCallback(async () => {
try {
setLoading(true);
const response = await zoneService.listZones(isActive);
const list = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : (response?.data?.content ?? response?.content ?? []);
setZones(list);
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

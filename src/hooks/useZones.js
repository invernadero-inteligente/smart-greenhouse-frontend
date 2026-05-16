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
setZones(Array.isArray(response) ? response : (response.content ?? []));
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
setZones(prev => [...prev, response]);
return response;
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
const response = await zoneService.updateZone(id, data);
setZones(prev => prev.map(z => z.id === id ? response : z));
return response;
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
await zoneService.deleteZone(id);
setZones(prev => prev.filter(z => z.id !== id));
} catch (err) {
if (!err.response) {
setZones(prev => prev.filter(z => z.id !== id));
return;
}
setError(err.message);
throw err;
}
};

return { zones, loading, error, fetchZones, createZone, updateZone, deleteZone };
}

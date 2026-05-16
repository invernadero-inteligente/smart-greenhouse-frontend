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
setCrops(Array.isArray(response) ? response : (response.content ?? []));
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
const response = await cropService.createCrop(data);
setCrops(prev => [...prev, response]);
return response;
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
const response = await cropService.updateCrop(id, data);
setCrops(prev => prev.map(c => c.id === id ? response : c));
return response;
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

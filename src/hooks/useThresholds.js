import { useState, useEffect, useCallback } from "react";
import { thresholdService } from "../services/threshold.service";

export function useThresholds(zoneIds = [], variables = []) {
const [thresholds, setThresholds] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const zoneIdsKey = JSON.stringify(zoneIds);
const variablesKey = JSON.stringify(variables);

const fetchThresholds = useCallback(async () => {
try {
setLoading(true);
const response = await thresholdService.listThresholds(zoneIds, variables);
setThresholds(Array.isArray(response) ? response : (response.content ?? []));
setError(null);
} catch (err) {
setError(err.message || "Error del servidor");
} finally {
setLoading(false);
}
}, [zoneIdsKey, variablesKey]);

useEffect(() => { fetchThresholds(); }, [fetchThresholds]);

const createThreshold = async (data) => {
try {
const response = await thresholdService.createThreshold(data);
setThresholds(prev => [...prev, response]);
return response;
} catch (err) {
if (!err.response) {
const newT = { ...data, id: Date.now() };
setThresholds(prev => [...prev, newT]);
return newT;
}
setError(err.message);
throw err;
}
};

const updateThreshold = async (id, data) => {
try {
await thresholdService.updateThreshold(id, data);
setThresholds(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
return true;
} catch (err) {
if (!err.response) {
setThresholds(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
return true;
}
setError(err.message);
throw err;
}
};

return { thresholds, loading, error, fetchThresholds, createThreshold, updateThreshold };
}

import { useState, useEffect, useCallback } from "react";
import { thresholdService } from "../services/threshold.service";

export function useThresholds(zoneIds = [], variables = []) {
	const [thresholds, setThresholds] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const zoneIdsKey = JSON.stringify(zoneIds);
	const variablesKey = JSON.stringify(variables);

	const fetchThresholds = useCallback(async () => {
		if (!zoneIds || zoneIds.length === 0) {
			setThresholds([]);
			setLoading(false);
			return;
		}
		try {
			setLoading(true);
			const response = await thresholdService.listThresholds(zoneIds, variables);
			// thresholdService.listThresholds returns the response body, which has shape { data: ThresholdZoneResponseDTO[] }
			const groups = response?.data ?? [];
			const flat = Array.isArray(groups)
				? groups.flatMap((group) => (group.variables ?? []).map((v) => ({ ...v, zoneId: group.zoneId })))
				: [];
			setThresholds(flat);
			setError(null);
		} catch (err) {
			setError(err.message || "Error del servidor");
		} finally {
			setLoading(false);
		}
	}, [zoneIdsKey, variablesKey]);

	useEffect(() => {
		fetchThresholds();
	}, [fetchThresholds]);

	const createThreshold = async (data) => {
		try {
			await thresholdService.createThreshold(data);
			await fetchThresholds();
			return true;
		} catch (err) {
			if (!err.response) {
				const newT = { ...data, id: Date.now() };
				setThresholds((prev) => [...prev, newT]);
				return newT;
			}
			const msg = err?.response?.data?.message ?? err.message ?? "Error al crear umbral";
			setError(msg);
			throw err;
		}
	};

	const updateThreshold = async (id, data) => {
		try {
			await thresholdService.updateThreshold(id, data);
			setThresholds((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
			return true;
		} catch (err) {
			if (!err.response) {
				setThresholds((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
				return true;
			}
			const msg = err?.response?.data?.message ?? err.message ?? "Error al actualizar umbral";
			setError(msg);
			throw err;
		}
	};

	return { thresholds, loading, error, fetchThresholds, createThreshold, updateThreshold };
}

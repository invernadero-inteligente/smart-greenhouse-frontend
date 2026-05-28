import { useState, useEffect, useCallback } from "react";
import { thresholdService } from "../services/threshold.service";
import { normalizeCreatedAt } from "../lib/utils";

const THRESHOLDS_ACTIVE_OVERRIDES_KEY = "smart-greenhouse.thresholds.active-overrides.v1";

function readOverrides() {
	try {
		const raw = localStorage.getItem(THRESHOLDS_ACTIVE_OVERRIDES_KEY);
		const parsed = raw ? JSON.parse(raw) : {};
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}

function writeOverrides(overrides) {
	localStorage.setItem(THRESHOLDS_ACTIVE_OVERRIDES_KEY, JSON.stringify(overrides));
}

export function useThresholds(zoneIds = [], variables = []) {
	const [thresholds, setThresholds] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [activeOverrides, setActiveOverrides] = useState(() => readOverrides());

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
			const flatRaw = Array.isArray(groups)
				? groups.flatMap((group) => (group.variables ?? []).map((v) => ({ ...v, zoneId: group.zoneId })))
				: [];

			const seen = new Set();
			const flat = flatRaw.filter((item) => {
				const key = String(item?.id);
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});

			const normalizedFlat = flat.map((item) => {
				const normalized = { ...item, createdAt: normalizeCreatedAt(item) };
				const override = activeOverrides[String(item.id)];
				return override === undefined ? normalized : { ...normalized, isActive: override };
			});

			setThresholds(normalizedFlat);
			if (normalizedFlat.length > 0 && !normalizedFlat.some((item) => item.createdAt)) {
				console.log("[useThresholds] No se encontró createdAt en umbrales. Sample:", normalizedFlat.slice(0, 3));
				const missing = normalizedFlat.filter((item) => !item.createdAt);
				try {
					const details = await Promise.all(
						missing.map((item) => thresholdService.getThresholdById(item.id).catch(() => null))
					);
					console.log("[useThresholds] threshold detail responses:", details);
					setThresholds((prev) =>
						prev.map((threshold) => {
							const det = details.find((d) => d && d.id === threshold.id);
							return det ? { ...threshold, createdAt: normalizeCreatedAt(det) ?? threshold.createdAt } : threshold;
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
	}, [zoneIdsKey, variablesKey, activeOverrides]);

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

	const deactivateThreshold = async (id) => {
		try {
			const result = await thresholdService.deactivateThreshold(id);
			if (result?.fallback) {
				setActiveOverrides((prev) => {
					const next = { ...prev, [String(id)]: false };
					writeOverrides(next);
					return next;
				});
			}
			setThresholds((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: false } : t)));
			return true;
		} catch (err) {
			if (!err.response) {
				setThresholds((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: false } : t)));
				return true;
			}
			const msg = err?.response?.data?.message ?? err.message ?? "Error al desactivar umbral";
			setError(msg);
			throw err;
		}
	};

	const reactivateThreshold = async (id) => {
		try {
			const result = await thresholdService.reactivateThreshold(id);
			if (result?.fallback) {
				setActiveOverrides((prev) => {
					const next = { ...prev, [String(id)]: true };
					writeOverrides(next);
					return next;
				});
			}
			setThresholds((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: true } : t)));
			return true;
		} catch (err) {
			if (!err.response) {
				setThresholds((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: true } : t)));
				return true;
			}
			const msg = err?.response?.data?.message ?? err.message ?? "Error al reactivar umbral";
			setError(msg);
			throw err;
		}
	};

	return {
		thresholds,
		loading,
		error,
		fetchThresholds,
		createThreshold,
		updateThreshold,
		deactivateThreshold,
		reactivateThreshold,
	};
}

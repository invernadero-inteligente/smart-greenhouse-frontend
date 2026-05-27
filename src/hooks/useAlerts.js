import { useState, useEffect, useCallback } from "react";
import { alertService } from "../services/alert.service";

export function useAlerts(initialFilters = {}) {
	const [alerts, setAlerts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [filters, setFilters] = useState(initialFilters);

	const fetchAlerts = useCallback(async (customFilters) => {
		try {
			setLoading(true);
			const response = await alertService.listAlerts(customFilters ?? filters);
			const list = response?.data ?? response ?? [];
			setAlerts(Array.isArray(list) ? list : []);
			setError(null);
		} catch (err) {
			setError(err.message || "Error del servidor");
		} finally {
			setLoading(false);
		}
	}, [filters]);

	useEffect(() => {
		fetchAlerts();
	}, [fetchAlerts]);

	const attendAlert = async (id) => {
		try {
			await alertService.attendAlert(id);
			setAlerts((prev) =>
				prev.map((a) => a.id === id ? { ...a, status: "ATTENDED" } : a)
			);
		} catch (err) {
			setError(err.message || "Error al atender la alerta");
			throw err;
		}
	};

	const applyFilters = (newFilters) => {
		setFilters(newFilters);
	};

	const openAlerts = alerts.filter((a) => a.status === "OPEN");
	const highAlerts = openAlerts.filter((a) => a.severity === "HIGH");
	const mediumAlerts = openAlerts.filter((a) => a.severity === "MEDIUM");

	return {
		alerts,
		openAlerts,
		highAlerts,
		mediumAlerts,
		loading,
		error,
		filters,
		fetchAlerts,
		attendAlert,
		applyFilters,
	};
}

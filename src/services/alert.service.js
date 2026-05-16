import { api } from "./api";

export const alertService = {
	async listAlerts(filters = {}) {
		const params = new URLSearchParams();
		
		if (filters.status) params.append("status", filters.status);
		if (filters.severity) params.append("severity", filters.severity);
		if (filters.zoneId) params.append("zoneId", filters.zoneId);
		
		const { data } = await api.get(`/api/alerts${params.toString() ? "?" + params.toString() : ""}`);
		return data;
	},

	async getAlertById(id) {
		const { data } = await api.get(`/api/alerts/${id}`);
		return data;
	},

	async resolveAlert(id) {
		const { data } = await api.patch(`/api/alerts/${id}/resolve`);
		return data;
	}
};

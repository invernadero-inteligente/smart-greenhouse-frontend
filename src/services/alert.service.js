import { api } from "./api";

export const alertService = {
	async listAlerts(filters = {}) {
		const params = new URLSearchParams();

		if (filters.status) params.append("status", filters.status);
		if (filters.zoneId) params.append("zoneId", filters.zoneId);
		if (filters.cropId) params.append("cropId", filters.cropId);
		if (filters.from) params.append("from", filters.from);
		if (filters.to) params.append("to", filters.to);

		const { data } = await api.get(`/api/alerts${params.toString() ? "?" + params.toString() : ""}`);
		return data;
	},

	async getAlertById(id) {
		const { data } = await api.get(`/api/alerts/${id}`);
		return data;
	},

	async attendAlert(id) {
		await api.put(`/api/alerts/${id}/attend`);
	},
};

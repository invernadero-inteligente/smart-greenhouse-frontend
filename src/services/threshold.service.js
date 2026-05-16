import { api } from "./api";

export const thresholdService = {
	async listThresholds(zoneIds = [], variables = []) {
		const params = new URLSearchParams();
		
		if (Array.isArray(zoneIds) && zoneIds.length > 0) {
			zoneIds.forEach(id => params.append("zoneId", id));
		}
		
		if (Array.isArray(variables) && variables.length > 0) {
			variables.forEach(v => params.append("variables", v));
		}
		
		const { data } = await api.get(`/api/thresholds${params.toString() ? "?" + params.toString() : ""}`);
		return data;
	},

	async createThreshold(payload) {
		const { data } = await api.post("/api/thresholds", payload);
		return data;
	},

	async updateThreshold(id, payload) {
		const { data } = await api.put(`/api/thresholds/${id}`, payload);
		return data;
	}
};

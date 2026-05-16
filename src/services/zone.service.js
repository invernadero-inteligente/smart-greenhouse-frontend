import { api } from "./api";

export const zoneService = {
	async listZones(isActive = null) {
		const params = new URLSearchParams();
		if (isActive !== null) {
			params.append("isActive", isActive);
		}
		const { data } = await api.get(`/api/zones${params.toString() ? "?" + params.toString() : ""}`);
		return data;
	},

	async getZoneById(id) {
		const { data } = await api.get(`/api/zones/${id}`);
		return data;
	},

	async createZone(payload) {
		const { data } = await api.post("/api/zones", payload);
		return data;
	},

	async updateZone(id, payload) {
		const { data } = await api.patch(`/api/zones/${id}`, payload);
		return data;
	}
};

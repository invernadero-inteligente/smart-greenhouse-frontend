import { api } from "./api";

export const cropService = {
	async listCrops(status = null, zoneId = null) {
		const params = new URLSearchParams();
		if (status) {
			params.append("status", status);
		}
		if (zoneId) {
			params.append("zoneId", zoneId);
		}
		const { data } = await api.get(`/api/crops${params.toString() ? "?" + params.toString() : ""}`);
		return data;
	},

	async getCropById(id) {
		const { data } = await api.get(`/api/crops/${id}`);
		return data;
	},

	async createCrop(payload) {
		const { data } = await api.post("/api/crops", payload);
		return data;
	},

	async updateCrop(id, payload) {
		const { data } = await api.patch(`/api/crops/${id}`, payload);
		return data;
	}
};

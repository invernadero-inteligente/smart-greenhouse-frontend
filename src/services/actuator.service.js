import { api } from "./api";

export const actuatorService = {
	async listActuators(zoneId = null) {
		const params = new URLSearchParams();
		if (zoneId) {
			params.append("zoneId", zoneId);
		}
		const { data } = await api.get(`/api/actuators${params.toString() ? "?" + params.toString() : ""}`);
		return data;
	},

	async getActuatorById(id) {
		const { data } = await api.get(`/api/actuators/${id}`);
		return data;
	},

	async toggleActuator(id, action) {
		const { data } = await api.patch(`/api/actuators/${id}`, { currentAction: action });
		return data;
	},

	async createActuator(payload) {
		const { data } = await api.post("/api/actuators", payload);
		return data;
	}
};

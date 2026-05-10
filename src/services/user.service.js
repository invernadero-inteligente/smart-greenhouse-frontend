import { api } from "./api";

export const userService = {
	async listUsers() {
		const { data } = await api.get("/api/admin/users");
		return data;
	},

	async getUser(id) {
		const { data } = await api.get(`/api/admin/users/${id}`);
		return data;
	},

	async createUser(payload) {
		const { data } = await api.post("/api/admin/users", payload);
		return data;
	},

	async updateUser(id, payload) {
		const { data } = await api.put(`/api/admin/users/${id}`, payload);
		return data;
	},

	async updateUserStatus(id, active) {
		const { data } = await api.patch(`/api/admin/users/${id}/status`, { active });
		return data;
	}
};

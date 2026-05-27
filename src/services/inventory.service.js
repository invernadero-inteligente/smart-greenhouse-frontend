import { api } from "./api";

export const inventoryService = {
	async listItems(filters = {}) {
		const params = new URLSearchParams();
		
		if (filters.category) params.append("category", filters.category);
		if (filters.lowStock !== undefined) params.append("lowStock", filters.lowStock);
		
		const { data } = await api.get(`/api/inventory${params.toString() ? "?" + params.toString() : ""}`);
		return data;
	},

	async getItemById(id) {
		const { data } = await api.get(`/api/inventory/${id}`);
		return data;
	},

	async createItem(payload) {
		const { data } = await api.post("/api/inventory", payload);
		return data;
	},

	async updateItem(id, payload) {
		const { data } = await api.patch(`/api/inventory/${id}`, payload);
		return data;
	},

	async deleteItem(id) {
		await api.delete(`/api/inventory/${id}`);
	}
};

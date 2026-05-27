import { api } from "./api";

export const zoneService = {
	async listZones(isActive = null) {
		if (isActive === null) {
			const [activeResponse, inactiveResponse] = await Promise.all([
				api.get("/api/zones?isActive=true"),
				api.get("/api/zones?isActive=false")
			]);

			const activeList = activeResponse?.data?.data ?? activeResponse?.data ?? [];
			const inactiveList = inactiveResponse?.data?.data ?? inactiveResponse?.data ?? [];
			const merged = [...activeList, ...inactiveList].reduce((acc, item) => {
				if (!acc.some((zone) => String(zone.id) === String(item.id))) {
					acc.push(item);
				}
				return acc;
			}, []);

			return { data: merged };
		}

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
	},

	async deleteZone(id) {
		const { data } = await api.patch(`/api/zones/${id}`, { isActive: false });
		return data;
	},

	async restoreZone(id) {
		const { data } = await api.patch(`/api/zones/${id}`, { isActive: true });
		return data;
	}
};

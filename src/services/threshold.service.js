import { api } from "./api";

function dedupeThresholdGroups(groups) {
	const byZone = new Map();

	(groups ?? []).forEach((group) => {
		const zoneId = group?.zoneId;
		if (!byZone.has(zoneId)) {
			byZone.set(zoneId, []);
		}

		const current = byZone.get(zoneId);
		const seen = new Set(current.map((item) => String(item.id)));

		(group?.variables ?? []).forEach((variable) => {
			const key = String(variable?.id);
			if (!seen.has(key)) {
				seen.add(key);
				current.push(variable);
			}
		});
	});

	return Array.from(byZone.entries()).map(([zoneId, variables]) => ({ zoneId, variables }));
}

export const thresholdService = {
	async listThresholds(zoneIds = [], variables = [], isActive = null) {
		const params = new URLSearchParams();
		
		if (Array.isArray(zoneIds) && zoneIds.length > 0) {
			zoneIds.forEach(id => params.append("zoneId", id));
		}
		
		if (Array.isArray(variables) && variables.length > 0) {
			variables.forEach(v => params.append("variables", v));
		}

		if (isActive !== null) {
			params.append("isActive", String(isActive));
		}
		
		const { data } = await api.get(`/api/thresholds${params.toString() ? "?" + params.toString() : ""}`);
		return {
			...data,
			data: dedupeThresholdGroups(data?.data ?? []),
		};
	},

	async createThreshold(payload) {
		const { data } = await api.post("/api/thresholds", payload);
		return data;
	},

	async updateThreshold(id, payload) {
		const { data } = await api.put(`/api/thresholds/${id}`, payload);
		return data;
	},

	async deactivateThreshold(id) {
		try {
			await api.patch(`/api/thresholds/${id}/deactivate`);
			return { fallback: false };
		} catch (error) {
			if (error?.response?.status === 404) {
				return { fallback: true };
			}
			throw error;
		}
	},

	async reactivateThreshold(id) {
		try {
			await api.patch(`/api/thresholds/${id}/reactivate`);
			return { fallback: false };
		} catch (error) {
			if (error?.response?.status === 404) {
				return { fallback: true };
			}
			throw error;
		}
	}
};

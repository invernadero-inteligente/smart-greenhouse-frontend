import { api } from "./api";
import { getApiErrorMessage } from "./api";


// CRUD actuadores backend
async function createActuator({ zoneId, name }) {
	if (!zoneId || !name?.trim()) throw new Error("Zona y nombre requeridos");
	const { data } = await api.post("/api/iot/actuator", {
		zone: { id: zoneId },
		name: name.trim(),
	});
	return data;
}

async function updateActuator({ id, zoneId, name }) {
	if (!id || !zoneId || !name?.trim()) throw new Error("ID, zona y nombre requeridos");
	const { data } = await api.put(`/api/iot/actuator/${id}`,
		{ id, zone: { id: zoneId }, name: name.trim() }
	);
	return data;
}

async function deleteActuator(id) {
	if (!id) throw new Error("ID requerido");
	await api.delete(`/api/iot/actuator/${id}`);
}

async function tryPost(paths, payload) {
	let lastError;
	for (const path of paths) {
		try {
			await api.post(path, payload);
			return;
		} catch (error) {
			lastError = error;
			if (error?.response?.status !== 404) {
				throw error;
			}
		}
	}
	throw lastError;
}

export const actuatorService = {
		createActuator,
		updateActuator,
		deleteActuator,
	async sendActuatorEvent(zoneId, actuatorName, action) {
		const normalizedAction = String(action ?? "").toUpperCase();

		if (!zoneId) {
			throw new Error("Debe seleccionar una zona");
		}

		if (!actuatorName?.trim()) {
			throw new Error("Debe indicar el nombre del actuador");
		}

		if (!["ON", "OFF"].includes(normalizedAction)) {
			throw new Error("La acción del actuador debe ser ON u OFF");
		}

		const payload = {
			name: actuatorName.trim(),
			action: normalizedAction,
		};

		try {
			await tryPost([
				`/api/iot/actuator/event/${zoneId}`,
				`/iot/actuator/event/${zoneId}`,
			], payload);
		} catch (error) {
			const status = error?.response?.status;
			if (status === 404) {
				throw new Error(
					"No existe el endpoint o el actuador/zona no está registrado en backend. Verifica zona ID, nombre del actuador y que el backend esté actualizado."
				);
			}
			throw new Error(getApiErrorMessage(error));
		}

		return {
			zoneId,
			actuatorName: payload.name,
			action: normalizedAction,
			sentAt: new Date().toISOString(),
		};
	},

	// Backward-compatible method for stale views/HMR chunks.
	async listActuators(zoneId = null) {
		try {
			const params = new URLSearchParams();
			if (zoneId != null) {
				params.append("zoneId", zoneId);
			}
			const { data } = await api.get(`/api/actuators${params.toString() ? "?" + params.toString() : ""}`);
			return data;
		} catch {
			return [];
		}
	},
};

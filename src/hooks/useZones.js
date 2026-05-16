import { useState, useEffect } from "react";
import { zoneService } from "../services/zone.service";

export function useZones(isActive = null) {
	const [zones, setZones] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchZones = async () => {
		try {
			setLoading(true);
			const response = await zoneService.listZones(isActive);
			setZones(response);
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchZones();
	}, [isActive]);

	const createZone = async (data) => {
		try {
			const response = await zoneService.createZone(data);
			setZones([...zones, response]);
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const updateZone = async (id, data) => {
		try {
			const response = await zoneService.updateZone(id, data);
			setZones(zones.map(z => (z.id === id ? response : z)));
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const getZoneById = async (id) => {
		try {
			return await zoneService.getZoneById(id);
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	return {
		zones,
		loading,
		error,
		fetchZones,
		createZone,
		updateZone,
		getZoneById
	};
}

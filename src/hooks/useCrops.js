import { useState, useEffect } from "react";
import { cropService } from "../services/crop.service";

export function useCrops(status = null, zoneId = null) {
	const [crops, setCrops] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchCrops = async () => {
		try {
			setLoading(true);
			const response = await cropService.listCrops(status, zoneId);
			setCrops(response);
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCrops();
	}, [status, zoneId]);

	const createCrop = async (data) => {
		try {
			const response = await cropService.createCrop(data);
			setCrops([...crops, response]);
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const updateCrop = async (id, data) => {
		try {
			const response = await cropService.updateCrop(id, data);
			setCrops(crops.map(c => (c.id === id ? response : c)));
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const getCropById = async (id) => {
		try {
			return await cropService.getCropById(id);
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	return {
		crops,
		loading,
		error,
		fetchCrops,
		createCrop,
		updateCrop,
		getCropById
	};
}

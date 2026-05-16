import { useState, useEffect } from "react";
import { thresholdService } from "../services/threshold.service";

export function useThresholds(zoneIds = [], variables = []) {
	const [thresholds, setThresholds] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchThresholds = async () => {
		try {
			setLoading(true);
			const response = await thresholdService.listThresholds(zoneIds, variables);
			setThresholds(response);
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchThresholds();
	}, [JSON.stringify(zoneIds), JSON.stringify(variables)]);

	const createThreshold = async (data) => {
		try {
			const response = await thresholdService.createThreshold(data);
			setThresholds([...thresholds, response]);
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const updateThreshold = async (id, data) => {
		try {
			await thresholdService.updateThreshold(id, data);
			await fetchThresholds();
			return true;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	return {
		thresholds,
		loading,
		error,
		fetchThresholds,
		createThreshold,
		updateThreshold
	};
}

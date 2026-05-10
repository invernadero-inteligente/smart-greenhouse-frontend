import axios from "axios";

const STORAGE_KEY = "invernadero_auth";

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080"
});

api.interceptors.request.use((config) => {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved) {
		try {
			const auth = JSON.parse(saved);
			if (auth?.token) {
				const tokenType = auth.tokenType ?? "Bearer";
				config.headers.Authorization = `${tokenType} ${auth.token}`;
			}
		} catch {
			// Keep request unchanged if local auth cache is invalid.
		}
	}

	return config;
});

export function getApiErrorMessage(error) {
	return (
		error?.response?.data?.message ||
		error?.response?.data?.error ||
		error?.message ||
		"No se pudo completar la solicitud"
	);
}

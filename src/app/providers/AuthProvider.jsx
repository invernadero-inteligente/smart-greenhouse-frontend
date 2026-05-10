import { createContext, useMemo, useState } from "react";
import { authService } from "../../services/auth.service";

export const AuthContext = createContext(null);

const STORAGE_KEY = "invernadero_auth";

function getInitialAuth() {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (!saved) {
		return { token: null, tokenType: "Bearer", role: null, email: null, userId: null };
	}

	try {
		return JSON.parse(saved);
	} catch {
		return { token: null, tokenType: "Bearer", role: null, email: null, userId: null };
	}
}

export function AuthProvider({ children }) {
	const [auth, setAuth] = useState(getInitialAuth);
	const [loading, setLoading] = useState(false);

	const persist = (nextAuth) => {
		setAuth(nextAuth);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
	};

	const login = async (payload) => {
		setLoading(true);
		try {
			const response = await authService.login(payload);
			const nextAuth = {
				token: response.token,
				tokenType: response.tokenType ?? "Bearer",
				role: response.role,
				email: response.email,
				userId: response.userId
			};
			persist(nextAuth);
			return response;
		} finally {
			setLoading(false);
		}
	};

	const register = async (payload) => {
		setLoading(true);
		try {
			const response = await authService.register(payload);
			const nextAuth = {
				token: response.token,
				tokenType: response.tokenType ?? "Bearer",
				role: response.role,
				email: response.email,
				userId: response.userId
			};
			persist(nextAuth);
			return response;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		const clean = { token: null, tokenType: "Bearer", role: null, email: null, userId: null };
		persist(clean);
	};

	const value = useMemo(
		() => ({
			auth,
			loading,
			login,
			register,
			logout,
			isAuthenticated: Boolean(auth.token),
			isAdmin: auth.role === "ADMIN"
		}),
		[auth, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

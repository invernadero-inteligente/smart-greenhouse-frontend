import { useState, useEffect } from "react";
import { userService } from "../services/user.service";

export function useUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await userService.listUsers();
			setUsers(response);
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const createUser = async (data) => {
		try {
			const response = await userService.createUser(data);
			setUsers([...users, response]);
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const updateUser = async (id, data) => {
		try {
			const response = await userService.updateUser(id, data);
			setUsers(users.map(u => (u.id === id ? response : u)));
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const updateUserStatus = async (id, active) => {
		try {
			const response = await userService.updateUserStatus(id, active);
			setUsers(users.map(u => (u.id === id ? response : u)));
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	const getUser = async (id) => {
		try {
			return await userService.getUser(id);
		} catch (err) {
			setError(err.message);
			throw err;
		}
	};

	return {
		users,
		loading,
		error,
		fetchUsers,
		createUser,
		updateUser,
		updateUserStatus,
		getUser
	};
}

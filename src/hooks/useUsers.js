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
setUsers(Array.isArray(response) ? response : (response.content ?? []));
setError(null);
} catch (err) {
setError(err.message || "Error del servidor");
} finally {
setLoading(false);
}
};

useEffect(() => { fetchUsers(); }, []);

const createUser = async (data) => {
try {
const response = await userService.createUser(data);
setUsers(prev => [...prev, response]);
return response;
} catch (err) {
if (!err.response) {
const newUser = { ...data, id: Date.now(), active: data.active ?? true };
setUsers(prev => [...prev, newUser]);
return newUser;
}
setError(err.message);
throw err;
}
};

const updateUser = async (id, data) => {
try {
const response = await userService.updateUser(id, data);
setUsers(prev => prev.map(u => u.id === id ? response : u));
return response;
} catch (err) {
if (!err.response) {
const updated = { ...users.find(u => u.id === id), ...data };
setUsers(prev => prev.map(u => u.id === id ? updated : u));
return updated;
}
setError(err.message);
throw err;
}
};

const updateUserStatus = async (id, active) => {
try {
const response = await userService.updateUserStatus(id, active);
setUsers(prev => prev.map(u => u.id === id ? { ...u, active } : u));
return response;
} catch (err) {
if (!err.response) {
setUsers(prev => prev.map(u => u.id === id ? { ...u, active } : u));
return;
}
setError(err.message);
throw err;
}
};

const getUser = async (id) => {
try {
return await userService.getUser(id);
} catch (err) {
if (!err.response) return users.find(u => u.id === id) ?? null;
setError(err.message);
throw err;
}
};

return { users, loading, error, fetchUsers, createUser, updateUser, updateUserStatus, getUser };
}

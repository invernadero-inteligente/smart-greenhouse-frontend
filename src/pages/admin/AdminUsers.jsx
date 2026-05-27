import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import UserCard from "../components/users/UserCard";
import UserForm from "../components/users/UserForm";

function AdminUsers() {
	const { users, loading, error, createUser, updateUser, updateUserStatus } = useUsers();
	const [showForm, setShowForm] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [filterRole, setFilterRole] = useState(null);
	const [filterActive, setFilterActive] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	let filteredUsers = users;
	if (filterRole) {
		filteredUsers = filteredUsers.filter(u => u.role === filterRole);
	}
	if (filterActive !== null) {
		filteredUsers = filteredUsers.filter(u => u.active === filterActive);
	}
	if (searchTerm) {
		filteredUsers = filteredUsers.filter(u =>
			u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			u.email.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	const handleSubmit = async (formData) => {
		try {
			setIsSubmitting(true);
			if (editingUser) {
				await updateUser(editingUser.id, formData);
				setEditingUser(null);
			} else {
				await createUser(formData);
			}
			setShowForm(false);
		} catch (err) {
			console.error("Error al guardar:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleToggleStatus = async (id, active) => {
		try {
			await updateUserStatus(id, active);
		} catch (err) {
			console.error("Error al cambiar estado:", err);
		}
	};

	const handleEdit = (user) => {
		setEditingUser(user);
		setShowForm(true);
	};

	const handleCancel = () => {
		setShowForm(false);
		setEditingUser(null);
	};

	if (loading && users.length === 0) {
		return (
			<div className="flex h-96 items-center justify-center">
				<p className="text-[#666]">Cargando usuarios...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				       <h1 className="font-heading text-3xl font-bold text-[var(--primary)]">
					       Gestión de Usuarios
				       </h1>
				       <button
					       onClick={() => {
						       setEditingUser(null);
						       setShowForm(!showForm);
					       }}
					       className="rounded-lg bg-[var(--primary)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--secondary)]"
				       >
					       {showForm ? "Cancelar" : "+ Nuevo Usuario"}
				       </button>
			</div>

			{error && (
				   <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{showForm && (
				       <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-6">
					       <h2 className="mb-4 font-heading text-lg font-bold text-[var(--primary)]">
						{editingUser ? "Editar Usuario" : "Nuevo Usuario"}
					</h2>
					<UserForm
						user={editingUser}
						onSubmit={handleSubmit}
						isLoading={isSubmitting}
						onCancel={handleCancel}
					/>
				</div>
			)}

			<div className="space-y-4">
				       <input
					       type="text"
					       placeholder="Buscar por nombre o email..."
					       value={searchTerm}
					       onChange={(e) => setSearchTerm(e.target.value)}
					       className="w-full rounded-lg border border-[var(--border)] px-4 py-2 font-body text-sm transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--secondary)]"
				       />

				       <div className="flex flex-wrap gap-2">
					       <button
						       onClick={() => {
							       setFilterRole(null);
							       setFilterActive(null);
						       }}
						       className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
							       filterRole === null && filterActive === null
								       ? "bg-[var(--primary)] text-white"
								       : "border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--card-muted)]"
						       }`}
					       >
						       Todos ({users.length})
					       </button>
					       <button
						       onClick={() => setFilterActive(true)}
						       className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
							       filterActive === true
								       ? "bg-[var(--primary)] text-white"
								       : "border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--card-muted)]"
						       }`}
					       >
						       Activos ({users.filter(u => u.active).length})
					       </button>
					       <button
						       onClick={() => setFilterActive(false)}
						       className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
							       filterActive === false
								       ? "bg-[var(--primary)] text-white"
								       : "border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--card-muted)]"
						       }`}
					       >
						       Inactivos ({users.filter(u => !u.active).length})
					       </button>
				       </div>

				       <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-2">
					       <span className="py-2 text-sm font-semibold text-[var(--muted)]">Por rol:</span>
					{["VIEWER", "TECHNICIAN", "MANAGER", "ADMIN"].map(role => {
						const roleLabels = {
							VIEWER: "Visualizador",
							TECHNICIAN: "Técnico",
							MANAGER: "Gestor",
							ADMIN: "Admin"
						};
						return (
							<button
								key={role}
								onClick={() => setFilterRole(filterRole === role ? null : role)}
								       className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
									       filterRole === role
										       ? "bg-[var(--primary)] text-white"
										       : "border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--card-muted)]"
								       }`}
							>
								{roleLabels[role]}
							</button>
						);
					})}
				</div>
			</div>

			{filteredUsers.length === 0 ? (
				       <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-8 text-center">
					       <p className="text-[var(--muted)]">
						{users.length === 0
							? "No hay usuarios"
							: "No hay usuarios que coincidan con los filtros"}
					</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredUsers.map(user => (
						<UserCard
							key={user.id}
							user={user}
							onEdit={handleEdit}
							onToggleStatus={handleToggleStatus}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default AdminUsers;

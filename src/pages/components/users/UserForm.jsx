import { useState } from "react";

function UserForm({ user, onSubmit, isLoading = false, onCancel }) {
	const [formData, setFormData] = useState({
	 fullName: user?.fullName || "",
	 email: user?.email || "",
	 password: "",
	 role: user?.role || "OPERATOR",
	 active: user?.active !== false
	});

	const [errors, setErrors] = useState({});

	const validateForm = () => {
		const newErrors = {};
		if (!formData.fullName.trim()) {
			newErrors.fullName = "El nombre completo es requerido";
		}
		if (!formData.email.trim()) {
			newErrors.email = "El email es requerido";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Email inválido";
		}
		if (!user && !formData.password) {
			newErrors.password = "La contraseña es requerida";
		}
		if (!formData.role) {
			newErrors.role = "Debe seleccionar un rol";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			const submitData = { ...formData };
			if (!user && !formData.password) {
				delete submitData.password;
			}
			onSubmit(submitData);
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
		<div>
			<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">Rol</label>
			<select
				name="role"
				value={formData.role}
				onChange={handleChange}
				className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
					errors.role
						? "border-[#b43a2f] bg-[#fbe8e5]"
						: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
				}`}
			>
				<option value="">Seleccionar rol</option>
				<option value="ADMIN">Administrador</option>
				<option value="OPERATOR">Operador</option>
				<option value="IOT_TECH">Técnico IoT</option>
				<option value="DATA_ANALYST">Analista de datos</option>
			</select>
			{errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
		</div>
		<div className="grid grid-cols-2 gap-4">
			<div>
				<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">Nombre Completo</label>
				<input
					type="text"
					name="fullName"
					value={formData.fullName}
					onChange={handleChange}
					className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
						errors.fullName
							? "border-[#b43a2f] bg-[#fbe8e5]"
							: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
					}`}
					placeholder="Nombre completo"
				/>
				{errors.fullName && (
					<p className="mt-1 text-xs text-[#b43a2f]">{errors.fullName}</p>
				)}
			</div>
			<div>
				<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">Email</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					disabled={!!user}
					className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
						errors.email
							? "border-[#b43a2f] bg-[#fbe8e5]"
							: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
					} ${user ? "bg-[#f5f5f5]" : ""}`}
					placeholder="usuario@ejemplo.com"
				/>
				{errors.email && (
					<p className="mt-1 text-xs text-[#b43a2f]">{errors.email}</p>
				)}
			</div>
		</div>
		{!user && (
			<div>
				<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">Contraseña</label>
				<input
					type="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
						errors.password
							? "border-[#b43a2f] bg-[#fbe8e5]"
							: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
					}`}
					placeholder="Mínimo 8 caracteres"
				/>
				{errors.password && (
					<p className="mt-1 text-xs text-[#b43a2f]">{errors.password}</p>
				)}
			</div>
		)}
		<div className="flex items-center gap-3 pt-2">
			<input
				type="checkbox"
				id="active"
				name="active"
				checked={formData.active}
				onChange={handleChange}
				className="h-4 w-4 accent-[#2f7f3c]"
			/>
			<label htmlFor="active" className="text-sm font-semibold text-[#1b4f2f]">
				Usuario activo
			</label>
		</div>
		<div className="flex gap-2 pt-4">
			<button
				type="submit"
				disabled={isLoading}
				className="flex-1 rounded-lg bg-[#2f7f3c] px-4 py-2 font-semibold text-white transition hover:bg-[#1b4f2f] disabled:opacity-50"
			>
				{isLoading ? "Guardando..." : user ? "Actualizar" : "Crear"}
			</button>
			{onCancel && (
				<button
					type="button"
					onClick={onCancel}
					className="flex-1 rounded-lg border border-[#d0e5c9] px-4 py-2 font-semibold text-[#1b4f2f] transition hover:bg-[#e9f5e6]"
				>
					Cancelar
				   </button>
			   )}
		   </div>
	</form>
);
}

	export default UserForm;

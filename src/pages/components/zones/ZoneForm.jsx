import { useState } from "react";

function ZoneForm({ zone, onSubmit, isLoading = false, onCancel }) {
	const [formData, setFormData] = useState({
		name: zone?.name || "",
		description: zone?.description || "",
		isActive: zone?.isActive !== false
	});

	const [errors, setErrors] = useState({});

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name.trim()) {
			newErrors.name = "El nombre es requerido";
		}
		if (formData.name.length < 3) {
			newErrors.name = "El nombre debe tener al menos 3 caracteres";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			onSubmit(formData);
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
				<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">
					Nombre de la Zona
				</label>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
						errors.name
							? "border-[#b43a2f] bg-[#fbe8e5]"
							: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
					}`}
					placeholder="Ej: Zona 1 - Tomates"
				/>
				{errors.name && (
					<p className="mt-1 text-xs text-[#b43a2f]">{errors.name}</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">
					Descripción
				</label>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleChange}
					rows="3"
					className="w-full rounded-lg border border-[#d0e5c9] px-4 py-2 font-body text-sm transition focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
					placeholder="Describe la zona..."
				/>
			</div>

			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					id="isActive"
					name="isActive"
					checked={formData.isActive}
					onChange={handleChange}
					className="h-4 w-4 accent-[#2f7f3c]"
				/>
				<label htmlFor="isActive" className="text-sm font-semibold text-[#1b4f2f]">
					Zona activa
				</label>
			</div>

			<div className="flex gap-2 pt-4">
				<button
					type="submit"
					disabled={isLoading}
					className="flex-1 rounded-lg bg-[#2f7f3c] px-4 py-2 font-semibold text-white transition hover:bg-[#1b4f2f] disabled:opacity-50"
				>
					{isLoading ? "Guardando..." : zone ? "Actualizar" : "Crear"}
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

export default ZoneForm;

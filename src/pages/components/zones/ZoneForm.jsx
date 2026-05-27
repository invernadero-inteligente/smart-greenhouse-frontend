import { useState } from "react";

function ZoneForm({ zone, onSubmit, isLoading = false, onCancel }) {
	const [formData, setFormData] = useState({
		name: zone?.name || "",
		description: zone?.description || "",
		isActive: (zone?.isActive ?? zone?.active) !== false
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
				<label className="mb-2 block text-sm font-semibold text-emerald-900">
					Nombre de la Zona
				</label>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					className={`w-full rounded-lg border bg-white px-4 py-2 font-body text-sm text-emerald-900 transition ${
						errors.name
							? "border-red-500/50 bg-red-50"
							: "border-[#e5e0c3] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/40"
					}`}
					placeholder="Ej: Zona 1 - Tomates"
				/>
				{errors.name && (
					<p className="mt-1 text-xs text-red-400">{errors.name}</p>
				)}
			</div>

			<div>
				<label className="mb-2 block text-sm font-semibold text-emerald-900">
					Descripción
				</label>
				<textarea
					name="description"
					value={formData.description}
					onChange={handleChange}
					rows="3"
					className="w-full rounded-lg border border-[#e5e0c3] bg-white px-4 py-2 font-body text-sm text-emerald-900 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/40"
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
					className="h-4 w-4 accent-emerald-500"
				/>
				<label htmlFor="isActive" className="text-sm font-semibold text-emerald-900">
					Zona activa
				</label>
			</div>

			<div className="flex gap-2 pt-4">
				<button
					type="submit"
					disabled={isLoading}
					className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
				>
					{isLoading ? "Guardando..." : zone ? "Actualizar" : "Crear"}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 rounded-lg border border-[#e5e0c3] px-4 py-2 font-semibold text-emerald-900 transition hover:bg-[#f5f3e7]"
					>
						Cancelar
					</button>
				)}
			</div>
		</form>
	);
}

export default ZoneForm;

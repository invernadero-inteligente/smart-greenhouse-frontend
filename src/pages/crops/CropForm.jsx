import { useState } from "react";
import { useZones } from "../../hooks/useZones";

function CropForm({ crop, onSubmit, isLoading = false, onCancel }) {
	const { zones } = useZones();
	const [formData, setFormData] = useState({
		name: crop?.name || "",
		variety: crop?.variety || "",
		zoneId: crop?.zoneId ? Number(crop.zoneId) : "",
		plantCount: crop?.plantCount || 0,
		sowingDate: crop?.sowingDate ? crop.sowingDate.split("T")[0] : "",
		status: crop?.status || "ACTIVE",
	});
	const [errors, setErrors] = useState({});

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name.trim()) {
			newErrors.name = "El nombre es requerido";
		}
		if (!formData.zoneId) {
			newErrors.zoneId = "Debe seleccionar una zona";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const payload = {
			...formData,
			sowingDate: formData.sowingDate || null,
			plantCount: formData.plantCount > 0 ? formData.plantCount : null,
			zoneId: formData.zoneId !== "" ? Number(formData.zoneId) : null,
		};

		onSubmit(payload);
	};

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]:
				name === "zoneId"
					? value === ""
						? ""
						: Number(value)
					: type === "number"
					? parseInt(value, 10) || 0
					: value,
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="mb-2 block text-sm font-semibold text-zinc-900">
						Nombre del Cultivo
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className={`w-full rounded-lg border bg-white px-4 py-2 font-body text-sm text-primary-900 transition ${
							errors.name
								? "border-red-500/50 bg-red-50"
								: "border-[#e5e0c3] focus:border-primary-500 focus:ring-2 focus:ring-primary-200/40"
						}`}
						placeholder="Ej: Tomate"
					/>
					{errors.name && (
						<p className="mt-1 text-xs text-red-400">{errors.name}</p>
					)}
				</div>

				<div>
					<label className="mb-2 block text-sm font-semibold text-zinc-700">
						Variedad
					</label>
					<input
						type="text"
						name="variety"
						value={formData.variety}
						onChange={handleChange}
						className="w-full rounded-lg border border-[#e5e0c3] bg-white px-4 py-2 font-body text-sm text-primary-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200/40"
						placeholder="Ej: Cherry"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="mb-2 block text-sm font-semibold text-zinc-700">
						Zona
					</label>
					<select
						name="zoneId"
						value={formData.zoneId}
						onChange={handleChange}
						className={`w-full rounded-lg border bg-white px-4 py-2 font-body text-sm text-primary-900 transition ${
							errors.zoneId
								? "border-red-500/50 bg-red-50"
								: "border-[#e5e0c3] focus:border-primary-500 focus:ring-2 focus:ring-primary-200/40"
						}`}
					>
						<option value="">Seleccionar zona</option>
						{zones.map((zone) => (
							<option key={zone.id} value={zone.id}>
								{zone.name}
							</option>
						))}
					</select>
					{errors.zoneId && (
						<p className="mt-1 text-xs text-red-400">{errors.zoneId}</p>
					)}
				</div>

				<div>
					<label className="mb-2 block text-sm font-semibold text-zinc-700">
						Cantidad de Plantas
					</label>
					<input
						type="number"
						name="plantCount"
						value={formData.plantCount}
						onChange={handleChange}
						className="w-full rounded-lg border border-[#e5e0c3] bg-white px-4 py-2 font-body text-sm text-primary-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200/40"
						placeholder="0"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="mb-2 block text-sm font-semibold text-zinc-700">
						Fecha de Siembra
					</label>
					<input
						type="date"
						name="sowingDate"
						value={formData.sowingDate}
						onChange={handleChange}
						className="w-full rounded-lg border border-[#e5e0c3] bg-white px-4 py-2 font-body text-sm text-primary-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200/40"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-semibold text-zinc-700">
						Estado
					</label>
					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="w-full rounded-lg border border-[#e5e0c3] bg-white px-4 py-2 font-body text-sm text-primary-900 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200/40"
					>
						<option value="ACTIVE">Activo</option>
						<option value="HARVEST">Cosechando</option>
						<option value="FINISHED">Finalizado</option>
					</select>
				</div>
			</div>

			<div className="flex gap-2 pt-4">
				<button
					type="submit"
					disabled={isLoading}
					className="flex-1 rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-50"
				>
					{isLoading ? "Guardando..." : crop ? "Actualizar" : "Crear"}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 rounded-lg border border-[#e5e0c3] px-4 py-2 font-semibold text-primary-900 transition hover:bg-[#f5f3e7]"
					>
						Cancelar
					</button>
				)}
			</div>
		</form>
	);
}

export default CropForm;


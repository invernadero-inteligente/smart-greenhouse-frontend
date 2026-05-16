import { useState, useEffect } from "react";
import { useZones } from "../../../hooks/useZones";

const VARIABLES = [
	"TEMPERATURE",
	"AIR_HUMIDITY",
	"SOIL_MOISTURE",
	"PH",
	"WATER_FLOW",
	"LUMINOSITY",
	"WATER_LEVEL"
];

const VARIABLE_LABELS = {
	TEMPERATURE: "Temperatura (°C)",
	AIR_HUMIDITY: "Humedad del Aire (%)",
	SOIL_MOISTURE: "Humedad del Suelo (%)",
	PH: "pH (escala)",
	WATER_FLOW: "Flujo de Agua (L/min)",
	LUMINOSITY: "Luminosidad (lux)",
	WATER_LEVEL: "Nivel de Agua (cm)"
};

const UNITS = {
	TEMPERATURE: "C",
	AIR_HUMIDITY: "%",
	SOIL_MOISTURE: "%",
	PH: "escala",
	WATER_FLOW: "L/min",
	LUMINOSITY: "lux",
	WATER_LEVEL: "cm"
};

function ThresholdForm({ threshold, onSubmit, isLoading = false, onCancel }) {
	const { zones } = useZones();
	const [formData, setFormData] = useState({
		zoneId: threshold?.zoneId || "",
		variableName: threshold?.variableName || threshold?.name || "",
		unit: threshold?.unit || "",
		minValue: threshold?.minValue || 0,
		maxValue: threshold?.maxValue || 0
	});

	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (formData.variableName && !formData.unit) {
			setFormData(prev => ({
				...prev,
				unit: UNITS[formData.variableName] || ""
			}));
		}
	}, [formData.variableName]);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.zoneId) {
			newErrors.zoneId = "Debe seleccionar una zona";
		}
		if (!formData.variableName) {
			newErrors.variableName = "Debe seleccionar una variable";
		}
		if (formData.minValue >= formData.maxValue) {
			newErrors.minValue = "El mínimo debe ser menor que el máximo";
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
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === "number" ? parseFloat(value) || 0 : value
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">
						Zona
					</label>
					<select
						name="zoneId"
						value={formData.zoneId}
						onChange={handleChange}
						disabled={!!threshold}
						className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
							errors.zoneId
								? "border-[#b43a2f] bg-[#fbe8e5]"
								: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
						} ${threshold ? "bg-[#f5f5f5]" : ""}`}
					>
						<option value="">Seleccionar zona</option>
						{zones.map(zone => (
							<option key={zone.id} value={zone.id}>
								{zone.name}
							</option>
						))}
					</select>
					{errors.zoneId && (
						<p className="mt-1 text-xs text-[#b43a2f]">{errors.zoneId}</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">
						Variable
					</label>
					<select
						name="variableName"
						value={formData.variableName}
						onChange={handleChange}
						disabled={!!threshold}
						className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
							errors.variableName
								? "border-[#b43a2f] bg-[#fbe8e5]"
								: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
						} ${threshold ? "bg-[#f5f5f5]" : ""}`}
					>
						<option value="">Seleccionar variable</option>
						{VARIABLES.map(var_name => (
							<option key={var_name} value={var_name}>
								{VARIABLE_LABELS[var_name]}
							</option>
						))}
					</select>
					{errors.variableName && (
						<p className="mt-1 text-xs text-[#b43a2f]">{errors.variableName}</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<div>
					<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">
						Unidad
					</label>
					<input
						type="text"
						name="unit"
						value={formData.unit}
						onChange={handleChange}
						disabled
						className="w-full rounded-lg border border-[#d0e5c9] bg-[#f5f5f5] px-4 py-2 font-body text-sm"
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">
						Mínimo
					</label>
					<input
						type="number"
						name="minValue"
						step="0.1"
						value={formData.minValue}
						onChange={handleChange}
						className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
							errors.minValue
								? "border-[#b43a2f] bg-[#fbe8e5]"
								: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
						}`}
					/>
				</div>

				<div>
					<label className="block text-sm font-semibold text-[#1b4f2f] mb-2">
						Máximo
					</label>
					<input
						type="number"
						name="maxValue"
						step="0.1"
						value={formData.maxValue}
						onChange={handleChange}
						className={`w-full rounded-lg border px-4 py-2 font-body text-sm transition ${
							errors.maxValue
								? "border-[#b43a2f] bg-[#fbe8e5]"
								: "border-[#d0e5c9] focus:border-[#2f7f3c] focus:ring-2 focus:ring-[#2f7f3c]/20"
						}`}
					/>
				</div>
			</div>

			{errors.minValue && (
				<p className="text-xs text-[#b43a2f]">{errors.minValue}</p>
			)}

			<div className="flex gap-2 pt-4">
				<button
					type="submit"
					disabled={isLoading}
					className="flex-1 rounded-lg bg-[#2f7f3c] px-4 py-2 font-semibold text-white transition hover:bg-[#1b4f2f] disabled:opacity-50"
				>
					{isLoading ? "Guardando..." : threshold ? "Actualizar" : "Crear"}
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

export default ThresholdForm;

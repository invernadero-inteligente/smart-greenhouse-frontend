import { useState } from "react";
import { useThresholds } from "../../hooks/useThresholds";
import { useZones } from "../../hooks/useZones";
import ThresholdCard from "../components/thresholds/ThresholdCard";
import ThresholdForm from "../components/thresholds/ThresholdForm";

function ThresholdsList() {
	const { zones } = useZones();
	const [selectedZones, setSelectedZones] = useState([]);
	const { thresholds, loading, error, createThreshold, updateThreshold } = useThresholds(selectedZones);

	const [showForm, setShowForm] = useState(false);
	const [editingThreshold, setEditingThreshold] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleZoneToggle = (zoneId) => {
		setSelectedZones(prev =>
			prev.includes(zoneId)
				? prev.filter(z => z !== zoneId)
				: [...prev, zoneId]
		);
	};

	const handleSubmit = async (formData) => {
		try {
			setIsSubmitting(true);
			if (editingThreshold) {
				await updateThreshold(editingThreshold.id, formData);
				setEditingThreshold(null);
			} else {
				await createThreshold(formData);
			}
			setShowForm(false);
		} catch (err) {
			console.error("Error al guardar:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (threshold) => {
		setEditingThreshold(threshold);
		setShowForm(true);
	};

	const handleCancel = () => {
		setShowForm(false);
		setEditingThreshold(null);
	};

	if (loading && thresholds.length === 0) {
		return (
			<div className="flex h-96 items-center justify-center">
				<p className="text-[#666]">Cargando umbrales...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
					Gestión de Umbrales
				</h1>
				<button
					onClick={() => {
						setEditingThreshold(null);
						setShowForm(!showForm);
					}}
					className="rounded-lg bg-[#2f7f3c] px-4 py-2 font-semibold text-white transition hover:bg-[#1b4f2f]"
				>
					{showForm ? "Cancelar" : "+ Nuevo Umbral"}
				</button>
			</div>

			{error && (
				<div className="rounded-lg border border-[#fde5e0] bg-[#fbe8e5] px-4 py-3 text-sm text-[#b43a2f]">
					{error}
				</div>
			)}

			{showForm && (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-6">
					<h2 className="mb-4 font-heading text-lg font-bold text-[#1b4f2f]">
						{editingThreshold ? "Editar Umbral" : "Nuevo Umbral"}
					</h2>
					<ThresholdForm
						threshold={editingThreshold}
						onSubmit={handleSubmit}
						isLoading={isSubmitting}
						onCancel={handleCancel}
					/>
				</div>
			)}

			{zones.length > 0 && (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-4">
					<p className="mb-3 text-sm font-semibold text-[#666]">Filtrar por zona:</p>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setSelectedZones([])}
							className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
								selectedZones.length === 0
									? "bg-[#2f7f3c] text-white"
									: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
							}`}
						>
							Todas ({zones.length})
						</button>
						{zones.map(zone => (
							<button
								key={zone.id}
								onClick={() => handleZoneToggle(zone.id)}
								className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
									selectedZones.includes(zone.id)
										? "bg-[#2f7f3c] text-white"
										: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
								}`}
							>
								{zone.name}
							</button>
						))}
					</div>
				</div>
			)}

			{thresholds.length === 0 ? (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-8 text-center">
					<p className="text-[#666]">
						{zones.length === 0
							? "Crea zonas primero para agregar umbrales"
							: "No hay umbrales configurados"}
					</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{thresholds.map(threshold => (
						<ThresholdCard
							key={threshold.id}
							threshold={threshold}
							onEdit={handleEdit}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default ThresholdsList;

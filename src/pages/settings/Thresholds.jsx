import { useState } from "react";
import { useThresholds } from "../../hooks/useThresholds";
import { useZones } from "../../hooks/useZones";
import { useAuth } from "../../hooks/useAuth";
import { canEdit } from "../../utils/permissions";
import ThresholdCard from "../components/thresholds/ThresholdCard";
import ThresholdForm from "../components/thresholds/ThresholdForm";

function ThresholdsList() {
	const { auth } = useAuth();
	const allowEdit = canEdit(auth.role);
	const { zones } = useZones();
	const [selectedZones, setSelectedZones] = useState([]);
	const [activeFilter, setActiveFilter] = useState(null);
	const allZoneIds = zones.map(z => z.id);
	const fetchIds = selectedZones.length > 0 ? selectedZones : allZoneIds;
	const {
		thresholds,
		loading,
		error,
		createThreshold,
		updateThreshold,
		deactivateThreshold,
		reactivateThreshold,
	} = useThresholds(fetchIds);

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

	const handleDeactivate = async (thresholdId) => {
		try {
			await deactivateThreshold(thresholdId);
		} catch (err) {
			console.error("Error al desactivar umbral:", err);
		}
	};

	const handleActivate = async (thresholdId) => {
		try {
			await reactivateThreshold(thresholdId);
		} catch (err) {
			console.error("Error al reactivar umbral:", err);
		}
	};

	const filteredThresholds = activeFilter === null
		? thresholds
		: thresholds.filter((threshold) => (threshold?.isActive !== false) === activeFilter);

	if (loading && thresholds.length === 0) {
		return (
			<div className="flex h-96 items-center justify-center">
				<p className="text-primary-600">Cargando umbrales...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 rounded-3xl border border-[#e5e0c3] bg-white/90 p-7">
			<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e5e0c3] bg-[#f5f3e7] px-7 py-5">
				<div>
					<h1 className="font-heading text-3xl font-bold text-primary-700">
						Gestión de Umbrales
					</h1>
					<p className="mt-1 text-base text-primary-700/80">Control de rangos por zona y variable.</p>
				</div>
				{allowEdit && (
					<button
						onClick={() => {
							setEditingThreshold(null);
							setShowForm(!showForm);
						}}
						className="rounded-2xl bg-primary-500 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-primary-600"
					>
						{showForm ? "Cancelar" : "+ Nuevo Umbral"}
					</button>
				)}
			</div>

			{error && (
				<div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{error}
				</div>
			)}

			{allowEdit && showForm && (
				<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-6">
					<h2 className="mb-4 font-heading text-lg font-bold text-primary-900">
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
				<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-4">
					<p className="mb-3 text-sm font-semibold text-primary-700/60">Filtrar por zona:</p>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setSelectedZones([])}
							className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
								selectedZones.length === 0
									? "border-transparent bg-primary-500 text-white"
									: "border-[#e5e0c3] bg-white text-primary-900 hover:bg-[#f5f3e7]"
							}`}
						>
							Todas ({zones.length})
						</button>
						{zones.map(zone => (
							<button
								key={zone.id}
								onClick={() => handleZoneToggle(zone.id)}
								className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
									selectedZones.includes(zone.id)
										   ? "border-transparent bg-primary-500 text-white hover:bg-primary-400"
										   : "border-[#e5e0c3] bg-white/90 text-primary-900 hover:bg-[#f5f3e7]"
								}`}
							>
								{zone.name}
							</button>
						))}
					</div>

					<div className="mt-4 flex flex-wrap gap-2">
						<button
							onClick={() => setActiveFilter(null)}
							className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
								activeFilter === null
									? "border-transparent bg-primary-500 text-white"
									: "border-[#e5e0c3] bg-white text-primary-900 hover:bg-[#f5f3e7]"
							}`}
						>
							Todos ({thresholds.length})
						</button>
						<button
							onClick={() => setActiveFilter(true)}
							className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
								activeFilter === true
									? "border-transparent bg-primary-500 text-white"
									: "border-[#e5e0c3] bg-white text-primary-900 hover:bg-[#f5f3e7]"
							}`}
						>
							Activos ({thresholds.filter((threshold) => threshold?.isActive !== false).length})
						</button>
						<button
							onClick={() => setActiveFilter(false)}
							className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
								activeFilter === false
									? "border-transparent bg-primary-500 text-white"
									: "border-[#e5e0c3] bg-white text-primary-900 hover:bg-[#f5f3e7]"
							}`}
						>
							Inactivos ({thresholds.filter((threshold) => threshold?.isActive === false).length})
						</button>
					</div>
				</div>
			)}

			{filteredThresholds.length === 0 ? (
				<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-10 text-center">
					<p className="text-primary-700/60">
						{zones.length === 0
							? "Crea zonas primero para agregar umbrales"
							: "No hay umbrales con ese filtro"}
					</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredThresholds.map(threshold => {
						const zone = zones.find(z => z.id === threshold.zoneId);
						return (
							<ThresholdCard
								key={threshold.id}
								threshold={threshold}
								zoneName={zone?.name}
								onEdit={allowEdit ? handleEdit : undefined}
								onDeactivate={allowEdit ? handleDeactivate : undefined}
								onActivate={allowEdit ? handleActivate : undefined}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default ThresholdsList;


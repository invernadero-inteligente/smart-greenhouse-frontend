import { useState, useEffect } from "react";
import { useZones } from "../../hooks/useZones";
import { useAuth } from "../../hooks/useAuth";
import { canEdit } from "../../utils/permissions";
import ZoneCard from "../components/zones/ZoneCard";
import ZoneForm from "../components/zones/ZoneForm";

function ZonesList() {
	const { auth } = useAuth();
	const allowEdit = canEdit(auth.role);
	const { zones, loading, error, fetchZones, createZone, updateZone, deleteZone, restoreZone } = useZones();
	const [showForm, setShowForm] = useState(false);
	const [editingZone, setEditingZone] = useState(null);
	const [filterActive, setFilterActive] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const filteredZones = filterActive === null
		? zones
		: zones.filter(z => (z.isActive ?? z.active) === filterActive);

	const handleSubmit = async (formData) => {
		try {
			setIsSubmitting(true);
			if (editingZone) {
				await updateZone(editingZone.id, formData);
				setEditingZone(null);
			} else {
				await createZone(formData);
			}
			setShowForm(false);
		} catch (err) {
			console.error("Error al guardar:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (zone) => {
		setEditingZone(zone);
		setShowForm(true);
	};

	const handleCancel = () => {
		setShowForm(false);
		setEditingZone(null);
	};

	const handleDeactivate = async (zoneId) => {
		try {
			await deleteZone(zoneId);
		} catch (err) {
			console.error("Error al desactivar zona:", err);
		}
	};

	const handleActivate = async (zoneId) => {
		try {
			await restoreZone(zoneId);
		} catch (err) {
			console.error("Error al reactivar zona:", err);
		}
	};

	if (loading && zones.length === 0) {
		return (
			<div className="flex h-96 items-center justify-center">
				<p className="text-primary-600">Cargando zonas...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 rounded-3xl border border-[#e5e0c3] bg-white/90 p-7">
			   <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e5e0c3] bg-[#f5f3e7] px-7 py-5">
				<div>
					<h1 className="font-heading text-3xl font-bold text-primary-700">
						Gestión de Zonas
					</h1>
					<p className="mt-1 text-base text-primary-700/80">Administra zonas operativas y su estado lógico.</p>
				</div>
				{allowEdit && (
					<button
						onClick={() => {
							setEditingZone(null);
							setShowForm(!showForm);
						}}
						className="rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400"
					>
						{showForm ? "Cancelar" : "+ Nueva Zona"}
					</button>
				)}
			</div>

			{error && (
				<div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
					{error}
				</div>
			)}

			   {showForm && (
				   <div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-6">
					   <h2 className="mb-4 font-heading text-lg font-bold text-primary-900">
						{editingZone ? "Editar Zona" : "Nueva Zona"}
					</h2>
					<ZoneForm
						zone={editingZone}
						onSubmit={handleSubmit}
						isLoading={isSubmitting}
						onCancel={handleCancel}
					/>
				</div>
			)}

			   <div className="flex flex-wrap gap-2 rounded-2xl border border-[#e5e0c3] bg-white/90 p-3">
				<button
					onClick={() => setFilterActive(null)}
					className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
						filterActive === null
							? "border-transparent bg-primary-500 text-white"
							: "border-[#e5e0c3] bg-white/90 text-primary-900 hover:bg-[#f5f3e7]"
					}`}
				>
					Todas ({zones.length})
				</button>
				<button
					onClick={() => setFilterActive(true)}
					className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
						filterActive === true
							? "border-transparent bg-primary-500 text-zinc-950"
							: "border-[#e5e0c3] bg-white/90 text-primary-900 hover:bg-[#f5f3e7]"
					}`}
				>
					Activas ({zones.filter(z => (z.isActive ?? z.active)).length})
				</button>
				<button
					onClick={() => setFilterActive(false)}
					className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
						filterActive === false
							? "border-transparent bg-primary-500 text-zinc-950"
							: "border-[#e5e0c3] bg-white/90 text-primary-900 hover:bg-[#f5f3e7]"
					}`}
				>
					Inactivas ({zones.filter(z => !(z.isActive ?? z.active)).length})
				</button>
			</div>

			{filteredZones.length === 0 ? (
				<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-10 text-center shadow-sm">
					<p className="text-zinc-400">
						{filterActive !== null
							? "No hay zonas con ese estado"
							: "No hay zonas creadas"}
					</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredZones.map(zone => (
						<ZoneCard
							key={zone.id}
							zone={zone}
							onEdit={allowEdit ? handleEdit : undefined}
							onDeactivate={allowEdit ? handleDeactivate : undefined}
							onActivate={allowEdit ? handleActivate : undefined}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default ZonesList;


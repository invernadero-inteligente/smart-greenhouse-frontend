import { useState, useEffect } from "react";
import { useZones } from "../../hooks/useZones";
import { useAuth } from "../../hooks/useAuth";
import { canEdit } from "../../utils/permissions";
import ZoneCard from "../components/zones/ZoneCard";
import ZoneForm from "../components/zones/ZoneForm";

function ZonesList() {
	const { auth } = useAuth();
	const allowEdit = canEdit(auth.role);
	const { zones, loading, error, fetchZones, createZone, updateZone } = useZones();
	const [showForm, setShowForm] = useState(false);
	const [editingZone, setEditingZone] = useState(null);
	const [filterActive, setFilterActive] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const filteredZones = filterActive === null
		? zones
		: zones.filter(z => z.isActive === filterActive);

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

	if (loading && zones.length === 0) {
		return (
			<div className="flex h-96 items-center justify-center">
				<p className="text-[#666]">Cargando zonas...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
					Gestión de Zonas
				</h1>
				{allowEdit && (
					<button
						onClick={() => {
							setEditingZone(null);
							setShowForm(!showForm);
						}}
						className="rounded-lg bg-[#2f7f3c] px-4 py-2 font-semibold text-white transition hover:bg-[#1b4f2f]"
					>
						{showForm ? "Cancelar" : "+ Nueva Zona"}
					</button>
				)}
			</div>

			{error && (
				<div className="rounded-lg border border-[#fde5e0] bg-[#fbe8e5] px-4 py-3 text-sm text-[#b43a2f]">
					{error}
				</div>
			)}

			{showForm && (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-6">
					<h2 className="mb-4 font-heading text-lg font-bold text-[#1b4f2f]">
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

			<div className="flex gap-2">
				<button
					onClick={() => setFilterActive(null)}
					className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
						filterActive === null
							? "bg-[#2f7f3c] text-white"
							: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
					}`}
				>
					Todas ({zones.length})
				</button>
				<button
					onClick={() => setFilterActive(true)}
					className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
						filterActive === true
							? "bg-[#2f7f3c] text-white"
							: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
					}`}
				>
					Activas ({zones.filter(z => z.isActive).length})
				</button>
				<button
					onClick={() => setFilterActive(false)}
					className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
						filterActive === false
							? "bg-[#2f7f3c] text-white"
							: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
					}`}
				>
					Inactivas ({zones.filter(z => !z.isActive).length})
				</button>
			</div>

			{filteredZones.length === 0 ? (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-8 text-center">
					<p className="text-[#666]">
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
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default ZonesList;

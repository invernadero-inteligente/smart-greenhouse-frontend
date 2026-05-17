import { useState } from "react";
import { useCrops } from "../../hooks/useCrops";
import { useZones } from "../../hooks/useZones";
import { useAuth } from "../../hooks/useAuth";
import { canEdit } from "../../utils/permissions";
import CropCard from "../components/crops/CropCard";
import CropForm from "../components/crops/CropForm";

function CropsList() {
	const { auth } = useAuth();
	const allowEdit = canEdit(auth.role);
	const { crops, loading, error, createCrop, updateCrop } = useCrops();
	const { zones } = useZones();
	const [showForm, setShowForm] = useState(false);
	const [editingCrop, setEditingCrop] = useState(null);
	const [filterStatus, setFilterStatus] = useState(null);
	const [filterZone, setFilterZone] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	let filteredCrops = crops;
	if (filterStatus) {
		filteredCrops = filteredCrops.filter(c => c.status === filterStatus);
	}
	if (filterZone) {
		filteredCrops = filteredCrops.filter(c => c.zoneId === parseInt(filterZone));
	}

	const handleSubmit = async (formData) => {
		try {
			setIsSubmitting(true);
			if (editingCrop) {
				await updateCrop(editingCrop.id, formData);
				setEditingCrop(null);
			} else {
				await createCrop(formData);
			}
			setShowForm(false);
		} catch (err) {
			console.error("Error al guardar:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (crop) => {
		setEditingCrop(crop);
		setShowForm(true);
	};

	const handleCancel = () => {
		setShowForm(false);
		setEditingCrop(null);
	};

	if (loading && crops.length === 0) {
		return (
			<div className="flex h-96 items-center justify-center">
				<p className="text-[#666]">Cargando cultivos...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
					Gestión de Cultivos
				</h1>
				{allowEdit && (
					<button
						onClick={() => {
							setEditingCrop(null);
							setShowForm(!showForm);
						}}
						className="rounded-lg bg-[#2f7f3c] px-4 py-2 font-semibold text-white transition hover:bg-[#1b4f2f]"
					>
						{showForm ? "Cancelar" : "+ Nuevo Cultivo"}
					</button>
				)}
			</div>

			{error && (
				<div className="rounded-lg border border-[#fde5e0] bg-[#fbe8e5] px-4 py-3 text-sm text-[#b43a2f]">
					{error}
				</div>
			)}

			{allowEdit && showForm && (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-6">
					<h2 className="mb-4 font-heading text-lg font-bold text-[#1b4f2f]">
						{editingCrop ? "Editar Cultivo" : "Nuevo Cultivo"}
					</h2>
					<CropForm
						crop={editingCrop}
						onSubmit={handleSubmit}
						isLoading={isSubmitting}
						onCancel={handleCancel}
					/>
				</div>
			)}

			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => {
						setFilterStatus(null);
						setFilterZone(null);
					}}
					className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
						filterStatus === null && filterZone === null
							? "bg-[#2f7f3c] text-white"
							: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
					}`}
				>
					Todos ({crops.length})
				</button>
				<button
					onClick={() => setFilterStatus("ACTIVE")}
					className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
						filterStatus === "ACTIVE"
							? "bg-[#2f7f3c] text-white"
							: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
					}`}
				>
					Activos ({crops.filter(c => c.status === "ACTIVE").length})
				</button>
				<button
					onClick={() => setFilterStatus("HARVEST")}
					className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
						filterStatus === "HARVEST"
							? "bg-[#2f7f3c] text-white"
							: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
					}`}
				>
					Cosechando ({crops.filter(c => c.status === "HARVEST").length})
				</button>
			</div>

			{zones.length > 0 && (
				<div className="flex flex-wrap gap-2 border-t border-[#d0e5c9] pt-2">
					<span className="py-2 text-sm font-semibold text-[#666]">Filtrar por zona:</span>
					{zones.map(zone => (
						<button
							key={zone.id}
							onClick={() => setFilterZone(filterZone === zone.id ? null : zone.id)}
							className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
								filterZone === zone.id
									? "bg-[#2f7f3c] text-white"
									: "border border-[#d0e5c9] text-[#1b4f2f] hover:bg-[#e9f5e6]"
							}`}
						>
							{zone.name}
						</button>
					))}
				</div>
			)}

			{filteredCrops.length === 0 ? (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-8 text-center">
					<p className="text-[#666]">
						{crops.length === 0
							? "No hay cultivos creados"
							: "No hay cultivos que coincidan con los filtros"}
					</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredCrops.map(crop => (
						<CropCard
							key={crop.id}
							crop={crop}
							onEdit={allowEdit ? handleEdit : undefined}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default CropsList;

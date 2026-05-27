import { useState } from "react";
import { useCrops } from "../../hooks/useCrops";
import { useZones } from "../../hooks/useZones";
import { useAuth } from "../../hooks/useAuth";
import { canEdit } from "../../utils/permissions";
import CropCard from "../components/crops/CropCard";
import CropForm from "./CropForm";

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
				<p className="text-primary-600">Cargando cultivos...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 rounded-3xl border border-[#e5e0c3] bg-white/90 p-7">
			   <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e5e0c3] bg-[#f5f3e7] px-7 py-5">
				<div>
					<h1 className="font-heading text-3xl font-bold text-primary-700">
						Gestión de Cultivos
					</h1>
					<p className="mt-1 text-base text-primary-700/80">Seguimiento de estado, zona y ciclo de los cultivos.</p>
				</div>
				{allowEdit && (
					<button
						onClick={() => {
							setEditingCrop(null);
							setShowForm(!showForm);
						}}
						   className="rounded-2xl bg-primary-500 px-5 py-2.5 text-base font-semibold text-white transition hover:bg-primary-600"
					>
						{showForm ? "Cancelar" : "+ Nuevo Cultivo"}
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

			   <div className="flex flex-wrap gap-2 rounded-2xl border border-[#e5e0c3] bg-white/90 p-3">
				<button
					onClick={() => {
						setFilterStatus(null);
						setFilterZone(null);
					}}
					className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
						filterStatus === null && filterZone === null
							   ? "border-transparent bg-primary-500 text-white"
							   : "border-[#e5e0c3] bg-white/90 text-primary-900 hover:bg-[#f5f3e7]"
					}`}
				>
					Todos ({crops.length})
				</button>
				<button
					onClick={() => setFilterStatus("ACTIVE")}
					className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
						filterStatus === "ACTIVE"
							? "border-transparent bg-primary-500 text-white"
							: "border-[#e5e0c3] bg-white text-primary-900 hover:bg-[#f5f3e7]"
					}`}
				>
					Activos ({crops.filter(c => c.status === "ACTIVE").length})
				</button>
				<button
					onClick={() => setFilterStatus("HARVEST")}
					className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
						filterStatus === "HARVEST"
							? "border-transparent bg-primary-500 text-zinc-950"
							: "border-zinc-700 bg-zinc-950 text-zinc-200 hover:bg-zinc-800"
					}`}
				>
					Cosechando ({crops.filter(c => c.status === "HARVEST").length})
				</button>
			</div>

			{zones.length > 0 && (
				<div className="flex flex-wrap gap-2 rounded-2xl border border-[#e5e0c3] bg-white/90 p-3">
					<span className="py-2 text-sm font-semibold text-primary-700/60">Filtrar por zona:</span>
					{zones.map(zone => (
						<button
							key={zone.id}
							onClick={() => setFilterZone(filterZone === zone.id ? null : zone.id)}
							className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
								filterZone === zone.id
									? "border-transparent bg-primary-500 text-white"
									: "border-[#e5e0c3] bg-white text-primary-900 hover:bg-[#f5f3e7]"
							}`}
						>
							{zone.name}
						</button>
					))}
				</div>
			)}

			{filteredCrops.length === 0 ? (
				<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-10 text-center">
					<p className="text-zinc-400">
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


function CropCard({ crop, onEdit, onDelete }) {
	const statusConfig = {
		ACTIVE:   { cls: "bg-primary-100 text-primary-700", label: "Activo" },
		HARVEST:  { cls: "bg-[#fff7e0] text-[#b45309]", label: "Cosechando" },
		FINISHED: { cls: "bg-[#f5f3e7] text-[#b5a16a]", label: "Finalizado" }
	};

	const config = statusConfig[crop.status] || { cls: "bg-[#f5f3e7] text-[#b5a16a]", label: crop.status ?? "—" };

	return (
		<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-6 shadow-sm transition hover:shadow-md">
			<div className="space-y-3">
				<div>
					<h3 className="font-heading text-lg font-bold text-primary-900">
						{crop.name}
					</h3>
					<p className="text-xs text-primary-700/70">
						Variedad: {crop.variety || "No especificada"}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3 text-xs">
					<div>
						<p className="text-primary-700/70">Plantas</p>
						<p className="font-bold text-primary-900">{crop.plantCount || 0}</p>
					</div>
					<div>
						<p className="text-primary-700/70">Zona</p>
						<p className="font-bold text-primary-900">#{crop.zoneId || "-"}</p>
					</div>
					{crop.sowingDate && (
						<div>
							<p className="text-primary-700/70">Fecha siembra</p>
							<p className="font-bold text-primary-900">
								{new Date(crop.sowingDate).toLocaleDateString()}
							</p>
						</div>
					)}
				</div>

				<div className={"rounded-lg px-3 py-2 text-center text-xs font-semibold " + config.cls}>
					{config.label}
				</div>
			</div>

			<div className="mt-4 flex gap-2">
				{onEdit && (
					<button
						onClick={() => onEdit(crop)}
						className="flex-1 rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-600"
					>
						Editar
					</button>
				)}
				{onDelete && (
					<button
						onClick={() => onDelete(crop.id)}
						className="flex-1 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
					>
						Eliminar
					</button>
				)}
			</div>
		</div>
	);
}

export default CropCard;


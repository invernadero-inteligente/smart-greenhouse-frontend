function CropCard({ crop, onEdit, onDelete }) {
	const statusConfig = {
		PLANTED: { bg: "#e9f5e6", text: "#2f7f3c", label: "Plantado" },
		GROWING: { bg: "#fff4e6", text: "#9f6b3d", label: "Creciendo" },
		HARVESTING: { bg: "#f0f4ff", text: "#3d5f9f", label: "Cosechando" },
		HARVESTED: { bg: "#f0f0f0", text: "#666", label: "Cosechado" }
	};

	const config = statusConfig[crop.status] || statusConfig.GROWING;

	return (
		<div className="rounded-2xl border border-[#e9f5e6] bg-white p-6 shadow-soft transition hover:shadow-lg">
			<div className="space-y-3">
				<div>
					<h3 className="font-heading text-lg font-bold text-[#1b4f2f]">
						{crop.name}
					</h3>
					<p className="text-xs text-[#999]">
						Variedad: {crop.variety || "No especificada"}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3 text-xs">
					<div>
						<p className="text-[#666]">Plantas</p>
						<p className="font-bold text-[#1b4f2f]">{crop.plantCount || 0}</p>
					</div>
					<div>
						<p className="text-[#666]">Zona</p>
						<p className="font-bold text-[#1b4f2f]">#{crop.zoneId || "-"}</p>
					</div>
					{crop.sowingDate && (
						<div>
							<p className="text-[#666]">Fecha siembra</p>
							<p className="font-bold text-[#1b4f2f]">
								{new Date(crop.sowingDate).toLocaleDateString()}
							</p>
						</div>
					)}
				</div>

				<div
					className="rounded-lg px-3 py-2 text-xs font-semibold text-center"
					style={{ backgroundColor: config.bg, color: config.text }}
				>
					{config.label}
				</div>
			</div>

			<div className="mt-4 flex gap-2">
				{onEdit && (
					<button
						onClick={() => onEdit(crop)}
						className="flex-1 rounded-lg bg-[#2f7f3c] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1b4f2f]"
					>
						Editar
					</button>
				)}
				{onDelete && (
					<button
						onClick={() => onDelete(crop.id)}
						className="flex-1 rounded-lg bg-[#fbe8e5] px-3 py-2 text-sm font-semibold text-[#b43a2f] transition hover:bg-[#f5d9d5]"
					>
						Eliminar
					</button>
				)}
			</div>
		</div>
	);
}

export default CropCard;

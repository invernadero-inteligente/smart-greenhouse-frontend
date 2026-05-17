function ZoneCard({ zone, onEdit, onDelete }) {
	return (
		<div className="rounded-2xl border border-[#e9f5e6] bg-white p-6 shadow-soft transition hover:shadow-lg">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<h3 className="font-heading text-lg font-bold text-[#1b4f2f]">
						{zone.name}
					</h3>
					<p className="mt-2 text-sm text-[#666] line-clamp-2">
						{zone.description || "Sin descripción"}
					</p>
					<div className="mt-4 flex items-center gap-2">
						<span
							className={`inline-block h-3 w-3 rounded-full ${
								(zone.isActive ?? zone.active) ? "bg-[#2f7f3c]" : "bg-[#999]"
							}`}
						/>
						<span className="text-xs font-semibold text-[#666]">
							{(zone.isActive ?? zone.active) ? "Activa" : "Inactiva"}
						</span>
					</div>
				</div>
			</div>
			<div className="mt-4 flex gap-2">
				{onEdit && (
					<button
						onClick={() => onEdit(zone)}
						className="flex-1 rounded-lg bg-[#2f7f3c] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1b4f2f]"
					>
						Editar
					</button>
				)}
				{onDelete && (
					<button
						onClick={() => onDelete(zone.id)}
						className="flex-1 rounded-lg bg-[#fbe8e5] px-3 py-2 text-sm font-semibold text-[#b43a2f] transition hover:bg-[#f5d9d5]"
					>
						Eliminar
					</button>
				)}
			</div>
		</div>
	);
}

export default ZoneCard;

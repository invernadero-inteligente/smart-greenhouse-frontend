function ZoneCard({ zone, onEdit, onDeactivate, onActivate }) {
	const isActive = (zone.isActive ?? zone.active) !== false;

	return (
		<div className="rounded-2xl border border-zinc-300 bg-white p-6 shadow-soft transition hover:shadow-lg">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<h3 className="font-heading text-lg font-bold text-zinc-900">
						{zone.name}
					</h3>
					<p className="mt-2 line-clamp-2 text-sm text-zinc-500">
						{zone.description || "Sin descripción"}
					</p>
					<div className="mt-4 flex items-center gap-2">
						<span
							className={`inline-block h-3 w-3 rounded-full ${
								isActive ? "bg-emerald-500" : "bg-zinc-500"
							}`}
						/>
						<span className="text-xs font-semibold text-zinc-500">
							{isActive ? "Activa" : "Inactiva"}
						</span>
					</div>
				</div>
			</div>
			<div className="mt-4 flex gap-2">
				{onEdit && (
					<button
						onClick={() => onEdit(zone)}
						className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
					>
						Editar
					</button>
				)}
				{isActive && onDeactivate && (
					<button
						onClick={() => onDeactivate(zone.id)}
						className="flex-1 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
					>
						Desactivar
					</button>
				)}
				{!isActive && onActivate && (
					<button
						onClick={() => onActivate(zone.id)}
						className="flex-1 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
					>
						Reactivar
					</button>
				)}
			</div>
		</div>
	);
}

export default ZoneCard;

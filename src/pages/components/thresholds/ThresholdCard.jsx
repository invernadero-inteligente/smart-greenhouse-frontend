function ThresholdCard({ threshold, zoneName, onEdit, onDeactivate, onActivate }) {
	const isActive = threshold?.isActive !== false;

	return (
		<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-6 transition">
			<div className="space-y-4">
				<div>
					<div className="flex items-center justify-between gap-2">
						<h3 className="font-heading text-lg font-bold text-emerald-900">
							{threshold.name || threshold.variableName}
						</h3>
						<span
							className={
								"rounded px-2 py-0.5 text-[10px] font-bold " +
								(isActive ? "bg-emerald-100 text-emerald-700" : "bg-[#f5f3e7] text-emerald-400")
							}
						>
							{isActive ? "Activo" : "Inactivo"}
						</span>
					</div>
					<p className="text-xs text-emerald-700/60">
						Zona: {zoneName ?? (threshold.zoneId ? `ID: ${threshold.zoneId}` : "-")}
					</p>
				</div>

				<div className="space-y-2 rounded-lg bg-[#f5f3e7] p-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold text-emerald-700/60">Mínimo:</span>
						<span className="font-heading font-bold text-emerald-700">
							{threshold.minValue} {threshold.unit}
						</span>
					</div>
					<div className="h-2 w-full rounded-full bg-[#e5e0c3]" />
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold text-emerald-700/60">Máximo:</span>
						<span className="font-heading font-bold text-emerald-700">
							{threshold.maxValue} {threshold.unit}
						</span>
					</div>
				</div>

				{threshold.updatedAt && (
					<p className="text-xs text-emerald-700/60">
						Actualizado: {new Date(threshold.updatedAt).toLocaleDateString()}
					</p>
				)}
			</div>

			<div className="mt-4 flex gap-2">
				{onEdit && isActive && (
					<button
						onClick={() => onEdit(threshold)}
						className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
					>
						Editar
					</button>
				)}
				{onDeactivate && isActive && (
					<button
						onClick={() => onDeactivate(threshold.id)}
						className="flex-1 rounded-lg bg-[#fbe8e5] px-3 py-2 text-sm font-semibold text-[#b43a2f] transition hover:bg-[#f5cece]"
					>
						Desactivar
					</button>
				)}
				{onActivate && !isActive && (
					<button
						onClick={() => onActivate(threshold.id)}
						className="flex-1 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
					>
						Reactivar
					</button>
				)}
			</div>
		</div>
	);
}

export default ThresholdCard;

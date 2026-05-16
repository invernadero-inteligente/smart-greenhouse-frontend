function ThresholdCard({ threshold, onEdit, onDelete }) {
	return (
		<div className="rounded-2xl border border-[#e9f5e6] bg-white p-6 shadow-soft transition hover:shadow-lg">
			<div className="space-y-4">
				<div>
					<h3 className="font-heading text-lg font-bold text-[#1b4f2f]">
						{threshold.name || threshold.variableName}
					</h3>
					<p className="text-xs text-[#999]">
						Zona ID: {threshold.zoneId || "-"}
					</p>
				</div>

				<div className="space-y-2 rounded-lg bg-[#f9fcf8] p-4">
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold text-[#666]">Mínimo:</span>
						<span className="font-heading font-bold text-[#2f7f3c]">
							{threshold.minValue} {threshold.unit}
						</span>
					</div>
					<div className="h-2 w-full rounded-full bg-[#d0e5c9]" />
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold text-[#666]">Máximo:</span>
						<span className="font-heading font-bold text-[#2f7f3c]">
							{threshold.maxValue} {threshold.unit}
						</span>
					</div>
				</div>

				{threshold.updatedAt && (
					<p className="text-xs text-[#999]">
						Actualizado: {new Date(threshold.updatedAt).toLocaleDateString()}
					</p>
				)}
			</div>

			<div className="mt-4 flex gap-2">
				{onEdit && (
					<button
						onClick={() => onEdit(threshold)}
						className="flex-1 rounded-lg bg-[#2f7f3c] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#1b4f2f]"
					>
						Editar
					</button>
				)}
				{onDelete && (
					<button
						onClick={() => onDelete(threshold.id)}
						className="flex-1 rounded-lg bg-[#fbe8e5] px-3 py-2 text-sm font-semibold text-[#b43a2f] transition hover:bg-[#f5d9d5]"
					>
						Eliminar
					</button>
				)}
			</div>
		</div>
	);
}

export default ThresholdCard;

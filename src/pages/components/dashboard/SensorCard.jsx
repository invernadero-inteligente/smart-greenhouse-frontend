const STATUS_STYLES = {
	CRITICAL: {
		border: "border-red-500/40",
		bg: "bg-red-500/10",
		text: "text-red-400",
		label: "Crítico",
	},
	WARNING: {
		border: "border-amber-500/40",
		bg: "bg-amber-500/10",
		text: "text-amber-400",
		label: "Advertencia",
	},
	NORMAL: {
		border: "border-green-500/40",
		bg: "bg-green-500/10",
		text: "text-green-400",
		label: "Normal",
	},
	UNKNOWN: {
		border: "border-[#e5e0c3]",
		bg: "bg-[#f5f3e7]",
		text: "text-primary-700/60",
		label: "Sin dato",
	},
};

function formatVariable(variable) {
	return String(variable ?? "sensor").replace(/_/g, " ");
}

function formatTimestamp(timestamp) {
	if (!timestamp) return "Sin actualización";

	const date = new Date(timestamp);
	if (Number.isNaN(date.getTime())) return "Sin actualización";

	return date.toLocaleString("es", {
		dateStyle: "short",
		timeStyle: "short",
	});
}

export default function SensorCard({ sensor }) {
	const style = STATUS_STYLES[sensor?.status] ?? STATUS_STYLES.UNKNOWN;

	return (
		<article
			className={
				"rounded-2xl border border-[#e5e0c3] bg-white/90 p-4 shadow-sm " + style.border
			}
		>
			<header className="mb-2 flex items-center justify-between gap-2">
				<h3 className="font-heading text-sm font-bold capitalize text-primary-900">
					{formatVariable(sensor?.variable)}
				</h3>
				<span
					className={
						"rounded-full px-2 py-0.5 text-[10px] font-bold " + style.bg + " " + style.text
					}
				>
					{style.label}
				</span>
			</header>

			<p className="font-heading text-2xl font-bold text-primary-900">
				{sensor?.value ?? "--"}
				<span className="ml-1 text-sm font-semibold text-primary-700/60">{sensor?.unit ?? ""}</span>
			</p>

			<div className="mt-2 space-y-1 text-xs text-primary-700/60">
				<p>Zona: {sensor?.zoneName ?? "Sin zona"}</p>
				<p>Estado nodo: {sensor?.zoneOnline ? "En línea" : "Fuera de línea"}</p>
				<p>Actualizado: {formatTimestamp(sensor?.timestamp)}</p>
			</div>
		</article>
	);
}


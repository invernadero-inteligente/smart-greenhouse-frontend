import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { canOperate } from "../../utils/permissions";
import { useAlerts } from "../../hooks/useAlerts";
import { useZones } from "../../hooks/useZones";

const SEVERITY_CONFIG = {
	HIGH:   { bg: "#fbe8e5", text: "#b43a2f", label: "Alta",    border: "#b43a2f" },
	MEDIUM: { bg: "#fff4e6", text: "#9f6b3d", label: "Media",   border: "#d4a04a" },
	LOW:    { bg: "#f0f4ff", text: "#3d5f9f", label: "Baja",    border: "#3d5f9f" },
};

const ORIGIN_LABELS = {
	IOT: "IoT",
	IA:  "IA",
};

const STATUS_LABELS = {
	OPEN:     "Activa",
	ATTENDED: "Atendida",
};

export default function AlertsList() {
	const { auth } = useAuth();
	const allowOperate = canOperate(auth.role);
	const { zones } = useZones(null);

	const [statusFilter, setStatusFilter] = useState("");
	const [zoneFilter, setZoneFilter] = useState("");

	const { alerts, openAlerts, highAlerts, mediumAlerts, loading, error, attendAlert } =
		useAlerts({ status: statusFilter || undefined, zoneId: zoneFilter || undefined });

	const handleAttend = async (id) => {
		try {
			await attendAlert(id);
		} catch (_) {}
	};

	const filtered = alerts.filter((a) => {
		if (statusFilter && a.status !== statusFilter) return false;
		if (zoneFilter && String(a.zoneId) !== String(zoneFilter)) return false;
		return true;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
						Alertas del sistema
					</h1>
					{!allowOperate && (
						<p className="mt-1 text-xs text-[#9dbaa5]">Solo lectura — no puedes atender alertas</p>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{highAlerts.length > 0 && (
						<span className="rounded-full bg-[#fbe8e5] px-3 py-1 text-sm font-bold text-[#b43a2f]">
							{highAlerts.length} alta{highAlerts.length > 1 ? "s" : ""}
						</span>
					)}
					{mediumAlerts.length > 0 && (
						<span className="rounded-full bg-[#fff4e6] px-3 py-1 text-sm font-bold text-[#9f6b3d]">
							{mediumAlerts.length} media{mediumAlerts.length > 1 ? "s" : ""}
						</span>
					)}
					{openAlerts.length === 0 && (
						<span className="rounded-full bg-[#e9f5e6] px-3 py-1 text-sm font-bold text-[#2f7f3c]">
							Sin alertas activas
						</span>
					)}
				</div>
			</div>

			{/* Filtros */}
			<div className="flex flex-wrap gap-3">
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="rounded-lg border border-[#d6e8d0] bg-white px-3 py-2 text-sm text-[#1b4f2f] focus:outline-none focus:ring-2 focus:ring-[#2f7f3c]"
				>
					<option value="">Todos los estados</option>
					<option value="OPEN">Activas</option>
					<option value="ATTENDED">Atendidas</option>
				</select>

				<select
					value={zoneFilter}
					onChange={(e) => setZoneFilter(e.target.value)}
					className="rounded-lg border border-[#d6e8d0] bg-white px-3 py-2 text-sm text-[#1b4f2f] focus:outline-none focus:ring-2 focus:ring-[#2f7f3c]"
				>
					<option value="">Todas las zonas</option>
					{zones.map((z) => (
						<option key={z.id} value={z.id}>{z.name}</option>
					))}
				</select>
			</div>

			{/* Error */}
			{error && (
				<div className="rounded-xl border border-[#fbe8e5] bg-[#fbe8e5] px-4 py-3 text-sm text-[#b43a2f]">
					{error}
				</div>
			)}

			{/* Lista */}
			<div className="space-y-3">
				{loading ? (
					<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-10 text-center">
						<p className="text-sm text-[#9dbaa5]">Cargando alertas…</p>
					</div>
				) : filtered.length === 0 ? (
					<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-10 text-center">
						<p className="font-heading text-lg font-semibold text-[#2f7f3c]">
							No hay alertas
						</p>
						<p className="mt-1 text-sm text-[#9dbaa5]">
							{statusFilter || zoneFilter ? "Prueba cambiando los filtros" : "El sistema opera con normalidad"}
						</p>
					</div>
				) : (
					filtered.map((alert) => {
						const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.LOW;
						const isAttended = alert.status === "ATTENDED";
						return (
							<div
								key={alert.id}
								className={
									"flex items-start justify-between gap-4 rounded-2xl border border-[#e9f5e6] bg-white p-5 transition " +
									(isAttended ? "opacity-60" : "")
								}
								style={{ borderLeftWidth: 4, borderLeftColor: isAttended ? "#9dbaa5" : cfg.border }}
							>
								<div className="flex-1 min-w-0">
									<div className="flex flex-wrap items-center gap-2 mb-1">
										<span
											className="rounded px-2 py-0.5 text-xs font-bold"
											style={{ backgroundColor: cfg.bg, color: cfg.text }}
										>
											{cfg.label}
										</span>
										<span className="text-sm font-semibold text-[#3a5745]">
											{alert.zoneName ?? `Zona ${alert.zoneId}`}
										</span>
										{alert.cropName && (
											<span className="text-xs text-[#6b8f72]">· {alert.cropName}</span>
										)}
										<span className="rounded bg-[#f0f4ff] px-2 py-0.5 text-[10px] font-semibold text-[#3d5f9f]">
											{ORIGIN_LABELS[alert.origin] ?? alert.origin}
										</span>
										{isAttended && (
											<span className="rounded bg-[#e9f5e6] px-2 py-0.5 text-[10px] font-semibold text-[#2f7f3c]">
												Atendida
											</span>
										)}
									</div>
									<p className="font-heading text-base font-bold text-[#1b4f2f]">
										{alert.variableName?.replace(/_/g, " ")}
									</p>
									<p className="mt-1 text-sm text-[#6b8f72]">{alert.message}</p>
									<div className="mt-2 flex flex-wrap items-center gap-4">
										{alert.value != null && (
											<span className="text-sm font-semibold text-[#1b4f2f]">
												{alert.value} {alert.unit}
											</span>
										)}
										<span className="text-xs text-[#9dbaa5]">
											{alert.createdAt
												? new Date(alert.createdAt).toLocaleString("es", {
													dateStyle: "short",
													timeStyle: "short",
												})
												: "—"}
										</span>
										{isAttended && alert.attendedByName && (
											<span className="text-xs text-[#6b8f72]">
												Atendida por {alert.attendedByName}
											</span>
										)}
									</div>
								</div>
								{allowOperate && !isAttended && (
									<button
										onClick={() => handleAttend(alert.id)}
										className="shrink-0 rounded-lg bg-[#e9f5e6] px-4 py-2 text-sm font-semibold text-[#2f7f3c] transition hover:bg-[#d0e5c9]"
									>
										Atender
									</button>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

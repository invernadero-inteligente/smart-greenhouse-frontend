import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { canOperate } from "../../utils/permissions";
import { useAlerts } from "../../hooks/useAlerts";
import { useZones } from "../../hooks/useZones";

const SEVERITY_CONFIG = {
  HIGH:   { badge: "bg-rose-100 text-rose-700", label: "Alta", border: "border-rose-200" },
  MEDIUM: { badge: "bg-amber-100 text-amber-700", label: "Media", border: "border-amber-200" },
  LOW:    { badge: "bg-primary-100 text-primary-700", label: "Baja", border: "border-primary-200" },
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

	const [statusFilter, setStatusFilter] = useState("OPEN");
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
	 	<div className="space-y-7 rounded-3xl border border-[#e5e0c3] bg-white/90 p-8">
			{/* Header */}
	 		<div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#e5e0c3] bg-[#f5eedc] px-7 py-5">
				<div>
					<h1 className="font-heading text-3xl font-bold text-primary-700 tracking-tight">Alertas del sistema</h1>
					<p className="mt-1 text-base text-primary-700/80">Monitoreo operativo de eventos críticos y su atención.</p>
					{!allowOperate && (
						<p className="mt-1 text-xs text-amber-700/80">Solo lectura no puedes atender alertas</p>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{highAlerts.length > 0 && (
						<span className="rounded-full bg-rose-100 px-3 py-1 text-base font-bold text-rose-700 animate-pulse">
							{highAlerts.length} alta{highAlerts.length > 1 ? "s" : ""}
						</span>
					)}
					{mediumAlerts.length > 0 && (
						<span className="rounded-full bg-amber-100 px-3 py-1 text-base font-bold text-amber-700">
							{mediumAlerts.length} media{mediumAlerts.length > 1 ? "s" : ""}
						</span>
					)}
					{openAlerts.length === 0 && (
						<span className="rounded-full bg-primary-100 px-3 py-1 text-base font-bold text-primary-700">
							Sin alertas activas
						</span>
					)}
				</div>
			</div>

			{/* Filtros */}
	 		<div className="flex flex-wrap gap-4 rounded-2xl border border-[#e5e0c3] bg-[#f5eedc] p-4">
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
							   className="rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
				>
					<option value="OPEN">Activas</option>
					<option value="">Todos los estados</option>
					<option value="ATTENDED">Atendidas</option>
				</select>

				<select
					value={zoneFilter}
					onChange={(e) => setZoneFilter(e.target.value)}
							   className="rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
				>
					<option value="">Todas las zonas</option>
					{zones.map((z) => (
						<option key={z.id} value={z.id}>{z.name}</option>
					))}
				</select>
			</div>

			{/* Error */}
			{error && (
				   <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{/* Lista */}
			   <div className="space-y-3">
				{loading ? (
					       <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-10 text-center">
						       <p className="text-sm text-[var(--muted)]">Cargando alertas…</p>
					       </div>
				) : filtered.length === 0 ? (
					       <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-muted)] p-10 text-center">
						       <p className="font-heading text-lg font-semibold text-[var(--fg)]">
							       No hay alertas
						       </p>
						       <p className="mt-1 text-sm text-[var(--muted)]">
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
									       "relative flex items-start justify-between gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 transition " +
									       (isAttended ? "opacity-60" : "")
								       }
							>
											   <div className={"absolute left-0 top-0 h-full w-1 rounded-l-2xl " + (isAttended ? "bg-[var(--muted)]" : cfg.border.replace("border", "bg"))} />
								       <div className="min-w-0 flex-1 pl-1">
									       <div className="flex flex-wrap items-center gap-2 mb-1">
										       <span
											       className={"rounded px-2 py-0.5 text-xs font-bold " + cfg.badge}
										       >
											       {cfg.label}
										       </span>
										       <span className="text-sm font-semibold text-[var(--fg)]">
											       {alert.zoneName ?? `Zona ${alert.zoneId}`}
										       </span>
										       {alert.cropName && (
											       <span className="text-xs text-[var(--muted)]">· {alert.cropName}</span>
										       )}
										       <span className="rounded bg-[var(--secondary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--secondary)]">
											       {ORIGIN_LABELS[alert.origin] ?? alert.origin}
										       </span>
										       {isAttended && (
											       <span className="rounded bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
												       Atendida
											       </span>
										       )}
									       </div>
									       <p className="font-heading text-base font-bold text-[var(--fg)]">
										       {alert.variableName?.replace(/_/g, " ")}
									       </p>
									       <p className="mt-1 text-sm text-[var(--muted)]">{alert.message}</p>
									       <div className="mt-2 flex flex-wrap items-center gap-4">
										       {alert.value != null && (
											       <span className="text-sm font-semibold text-[var(--fg)]">
												       {alert.value} {alert.unit}
											       </span>
										       )}
										       <span className="text-xs text-[var(--muted)]">
											       {alert.createdAt
												       ? new Date(alert.createdAt).toLocaleString("es", {
													       dateStyle: "short",
													       timeStyle: "short",
												       })
												       : "—"}
										       </span>
										       {isAttended && alert.attendedByName && (
											       <span className="text-xs text-[var(--muted)]">
												       Atendida por {alert.attendedByName}
											       </span>
										       )}
									       </div>
								       </div>
								       {allowOperate && !isAttended && (
									       <button
										       onClick={() => handleAttend(alert.id)}
										       className="shrink-0 rounded-lg bg-[var(--secondary)]/10 px-4 py-2 text-sm font-semibold text-[var(--secondary)] transition hover:bg-[var(--secondary)] hover:text-white"
									       >
										       Borrar logico
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


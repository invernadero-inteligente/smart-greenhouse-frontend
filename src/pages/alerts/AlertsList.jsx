import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { canOperate } from "../../utils/permissions";
import { alertService } from "../../services/alert.service";

const SEVERITY_CONFIG = {
CRITICAL: { bg: "#fbe8e5", text: "#b43a2f", label: "Critica", border: "#b43a2f" },
WARNING:  { bg: "#fff4e6", text: "#9f6b3d", label: "Advertencia", border: "#d4a04a" },
INFO:     { bg: "#f0f4ff", text: "#3d5f9f", label: "Informacion", border: "#3d5f9f" },
};

export default function AlertsList() {
const { auth } = useAuth();
const allowOperate = canOperate(auth.role);
const [alerts, setAlerts] = useState([]);

useEffect(() => {
	alertService.listAlerts().then((data) => setAlerts(Array.isArray(data) ? data : (data.content ?? []))).catch(() => {});
}, []);

const resolve = async (id) => {
	try { await alertService.resolveAlert(id); } catch (_) {}
	setAlerts((prev) => prev.filter((a) => a.id !== id));
};

const critical = alerts.filter((a) => a.severity === "CRITICAL").length;
const warning  = alerts.filter((a) => a.severity === "WARNING").length;

return (
<div className="space-y-6">
{/* Header */}
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
Alertas del sistema
</h1>
{!allowOperate && (
<p className="mt-1 text-xs text-[#9dbaa5]">Solo lectura — no puedes resolver alertas</p>
)}
</div>
<div className="flex items-center gap-2">
{critical > 0 && (
<span className="rounded-full bg-[#fbe8e5] px-3 py-1 text-sm font-bold text-[#b43a2f]">
{critical} critica{critical > 1 ? "s" : ""}
</span>
)}
{warning > 0 && (
<span className="rounded-full bg-[#fff4e6] px-3 py-1 text-sm font-bold text-[#9f6b3d]">
{warning} advertencia{warning > 1 ? "s" : ""}
</span>
)}
{alerts.length === 0 && (
<span className="rounded-full bg-[#e9f5e6] px-3 py-1 text-sm font-bold text-[#2f7f3c]">
Sin alertas
</span>
)}
</div>
</div>

{/* List */}
<div className="space-y-3">
{alerts.length === 0 ? (
<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-10 text-center">
<p className="font-heading text-lg font-semibold text-[#2f7f3c]">
No hay alertas activas
</p>
<p className="mt-1 text-sm text-[#9dbaa5]">El sistema opera con normalidad</p>
</div>
) : (
alerts.map((alert) => {
const cfg = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.INFO;
return (
<div
key={alert.id}
className="flex items-start justify-between gap-4 rounded-2xl border border-[#e9f5e6] bg-white p-5"
style={{ borderLeftWidth: 4, borderLeftColor: cfg.border }}
>
<div className="flex-1 min-w-0">
<div className="flex flex-wrap items-center gap-2 mb-1">
<span
className="rounded px-2 py-0.5 text-xs font-bold"
style={{ backgroundColor: cfg.bg, color: cfg.text }}
>
{cfg.label}
</span>
<span className="text-sm font-semibold text-[#3a5745]">{alert.zone}</span>
</div>
<p className="font-heading text-base font-bold text-[#1b4f2f]">
{alert.variableName.replace(/_/g, " ")}
</p>
<p className="mt-1 text-sm text-[#6b8f72]">{alert.message}</p>
<div className="mt-2 flex flex-wrap items-center gap-4">
<span className="text-sm font-semibold text-[#1b4f2f]">
{alert.value} {alert.unit}
</span>
<span className="text-xs text-[#9dbaa5]">
{new Date(alert.createdAt).toLocaleString("es", { dateStyle: "short", timeStyle: "short" })}
</span>
</div>
</div>
{allowOperate && (
<button
onClick={() => resolve(alert.id)}
className="shrink-0 rounded-lg bg-[#e9f5e6] px-4 py-2 text-sm font-semibold text-[#2f7f3c] transition hover:bg-[#d0e5c9]"
>
Resolver
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

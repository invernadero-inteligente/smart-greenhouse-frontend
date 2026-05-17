import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ROLE_LABELS = {
ADMIN: "Administrador",
MANAGER: "Gestor",
TECHNICIAN: "Técnico",
VIEWER: "Visualizador",
};

const ROLE_COLORS = {
ADMIN: "bg-[#fbe8e5] text-[#b43a2f]",
MANAGER: "bg-[#fff4e6] text-[#9f6b3d]",
TECHNICIAN: "bg-[#e9f5e6] text-[#2f7f3c]",
VIEWER: "bg-[#f0f4ff] text-[#3d5f9f]",
};

const MODULES = [
{ to: "/zonas", label: "Zonas", desc: "Gestiona tus áreas de cultivo", accent: "#2f7f3c" },
{ to: "/cultivos", label: "Cultivos", desc: "Seguimiento de siembra y cosecha", accent: "#4a7c3f" },
{ to: "/umbrales", label: "Umbrales", desc: "Configura rangos de variables", accent: "#9f6b3d" },
];

function greeting() {
const h = new Date().getHours();
if (h < 12) return "Buenos días";
if (h < 18) return "Buenas tardes";
return "Buenas noches";
}

function StatCard({ label, value, sub, valueColor }) {
return (
<div className="rounded-2xl border border-[#d6e8d0] bg-white p-5">
<p className="text-[10px] font-bold uppercase tracking-widest text-[#6b8f72]">{label}</p>
<p className={"mt-1 font-heading text-3xl font-bold " + valueColor}>{value}</p>
{sub && <p className="mt-0.5 text-xs text-[#9dbaa5]">{sub}</p>}
</div>
);
}

function ModuleCard({ to, label, desc, accent }) {
return (
<Link
to={to}
style={{ borderLeftColor: accent }}
className="group flex flex-col gap-1.5 rounded-2xl border border-[#d6e8d0] border-l-4 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
>
<p className="font-heading text-base font-bold text-[#1b4f2f]">{label}</p>
<p className="text-sm text-[#6b8f72]">{desc}</p>
<span
style={{ color: accent }}
className="mt-auto text-xs font-semibold group-hover:underline"
>
Ver &rarr;
</span>
</Link>
);
}

export default function Dashboard() {
const { auth, isAdmin } = useAuth();

const activeZones = 0;
	const activeCrops = 0;
	const pendingAlerts = 0;
	const lowStock = 0;

return (
<div className="space-y-6">
{/* Bienvenida */}
<div className="rounded-2xl border border-[#d6e8d0] bg-white p-6">
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<p className="text-[10px] font-bold uppercase tracking-widest text-[#9dbaa5]">
Panel general
</p>
<h1 className="mt-1 font-heading text-2xl font-bold text-[#1b4f2f]">
{greeting()}, {auth.fullName || auth.email}
</h1>
</div>
<span
className={
"rounded-full px-3 py-1 text-xs font-bold " +
(ROLE_COLORS[auth.role] ?? "bg-gray-100 text-gray-600")
}
>
{ROLE_LABELS[auth.role] ?? auth.role}
</span>
</div>
</div>

{/* Estadísticas */}
<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
<StatCard
label="Zonas activas"
value={activeZones}
sub="totales"
valueColor="text-[#2f7f3c]"
/>
<StatCard
label="Cultivos activos"
value={activeCrops}
sub="totales"
valueColor="text-[#1b4f2f]"
/>
<StatCard
label="Alertas pendientes"
value={pendingAlerts}
sub="requieren atención"
valueColor={pendingAlerts > 0 ? "text-[#b43a2f]" : "text-[#2f7f3c]"}
/>
<StatCard
label="Stock bajo"
value={lowStock}
sub="items por reabastecer"
valueColor={lowStock > 0 ? "text-[#9f6b3d]" : "text-[#2f7f3c]"}
/>
</div>

{/* Módulos */}
<div>
<h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#9dbaa5]">
Módulos del sistema
</h2>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
{MODULES.map((m) => (
<ModuleCard key={m.to} {...m} />
))}
{isAdmin && (
<ModuleCard
to="/admin/usuarios"
label="Usuarios"
desc="Gestiona los usuarios del sistema"
accent="#b43a2f"
/>
)}
{isAdmin && (
<ModuleCard
to="/backoffice"
label="Configuracion"
desc="Ajustes y parámetros globales"
accent="#3d5f9f"
/>
)}
</div>
</div>
</div>
);
}

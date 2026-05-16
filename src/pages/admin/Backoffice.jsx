import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useZones } from "../../hooks/useZones";
import { useCrops } from "../../hooks/useCrops";
import { useThresholds } from "../../hooks/useThresholds";
import { userService } from "../../services/user.service";
import { alertService } from "../../services/alert.service";
import { inventoryService } from "../../services/inventory.service";

const ROLES = ["ADMIN", "MANAGER", "TECHNICIAN", "VIEWER"];

const ROLE_LABELS = {
ADMIN: "Administrador",
MANAGER: "Gestor",
TECHNICIAN: "Técnico",
VIEWER: "Visualizador",
};

const ROLE_COLORS = {
ADMIN:      "bg-[#fbe8e5] text-[#b43a2f]",
MANAGER:    "bg-[#fff4e6] text-[#9f6b3d]",
TECHNICIAN: "bg-[#e9f5e6] text-[#2f7f3c]",
VIEWER:     "bg-[#f0f4ff] text-[#3d5f9f]",
};

const STATUS_CROP = {
GROWING:    { label: "En crecimiento", cls: "bg-[#e9f5e6] text-[#2f7f3c]" },
HARVESTING: { label: "Cosechando",     cls: "bg-[#fff4e6] text-[#9f6b3d]" },
PLANTED:    { label: "Plantado",        cls: "bg-[#f0f4ff] text-[#3d5f9f]" },
HARVESTED:  { label: "Cosechado",       cls: "bg-[#f0f0f0] text-[#666]" },
};

const SEVERITY_COLORS = {
CRITICAL: "bg-[#fbe8e5] text-[#b43a2f]",
WARNING:  "bg-[#fff4e6] text-[#9f6b3d]",
INFO:     "bg-[#f0f4ff] text-[#3d5f9f]",
};

const VAR_NAMES = {
TEMPERATURE:  "Temperatura",
AIR_HUMIDITY: "Humedad aire",
SOIL_MOISTURE:"Humedad suelo",
PH:           "pH",
LUMINOSITY:   "Luminosidad",
};

const CATEGORY_LABELS = {
FERTILIZER: "Fertilizante",
PESTICIDE:  "Pesticida",
SEEDS:      "Semillas",
TOOLS:      "Herramientas",
OTHER:      "Otro",
};

const daysAgo = (n) => {
const d = new Date();
d.setDate(d.getDate() - n);
return d;
};

const MOCK_AUDIT = [
{ id: 1, user: "Carlos Ramírez", action: "Creó zona", detail: "Zona A - Tomates", ts: daysAgo(0) },
{ id: 2, user: "María González", action: "Activó cultivo", detail: "Tomate Cherry", ts: daysAgo(0) },
{ id: 3, user: "Luis Herrera",   action: "Encendió actuador", detail: "Bomba de Riego A", ts: daysAgo(0) },
{ id: 4, user: "Carlos Ramírez", action: "Creó usuario", detail: "gestor@invernadero.com", ts: daysAgo(1) },
{ id: 5, user: "María González", action: "Actualizó umbral", detail: "Temperatura · Zona A", ts: daysAgo(1) },
{ id: 6, user: "Carlos Ramírez", action: "Resolvió alerta", detail: "SOIL_MOISTURE en Zona C", ts: daysAgo(2) },
{ id: 7, user: "Luis Herrera",   action: "Apagó actuador", detail: "Ventilador Zona A", ts: daysAgo(2) },
{ id: 8, user: "Carlos Ramírez", action: "Cambió rol",     detail: "visor@invernadero.com → VIEWER", ts: daysAgo(3) },
];

const SECTIONS = [
{ key: "resumen",    label: "Resumen general" },
{ key: "zonas",      label: "Zonas" },
{ key: "cultivos",   label: "Cultivos" },
{ key: "umbrales",   label: "Umbrales" },
{ key: "alertas",    label: "Alertas" },
{ key: "inventario", label: "Inventario" },
{ key: "usuarios",   label: "Usuarios" },
{ key: "auditoria",  label: "Auditoria" },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function Badge({ cls, children }) {
return (
<span className={"rounded-full px-2.5 py-0.5 text-xs font-bold " + cls}>
{children}
</span>
);
}

function SectionTitle({ title, sub }) {
return (
<div>
<h2 className="font-heading text-2xl font-bold text-[#1b4f2f]">{title}</h2>
{sub && <p className="mt-1 text-sm text-[#9dbaa5]">{sub}</p>}
</div>
);
}

function StatCard({ label, value, sub, valueColor }) {
return (
<div className="rounded-2xl border border-[#d6e8d0] bg-white p-5">
<p className="text-[10px] font-bold uppercase tracking-widest text-[#9dbaa5]">{label}</p>
<p className={"mt-1 font-heading text-3xl font-bold " + (valueColor ?? "text-[#1b4f2f]")}>{value}</p>
{sub && <p className="mt-0.5 text-xs text-[#9dbaa5]">{sub}</p>}
</div>
);
}

function Th({ children }) {
return <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-[#9dbaa5]">{children}</th>;
}

function Td({ children, className }) {
return <td className={"px-4 py-3 text-sm " + (className ?? "")}>{children}</td>;
}

function TableWrap({ children }) {
return (
<div className="overflow-x-auto rounded-2xl border border-[#d6e8d0]">
<table className="w-full">{children}</table>
</div>
);
}

function isStrongPassword(pw) {
return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

const EMPTY_FORM = { fullName: "", email: "", password: "", role: "VIEWER" };

// ─── componente principal ─────────────────────────────────────────────────────

export default function Backoffice() {
const { auth } = useAuth();
const [active, setActive]   = useState("resumen");
const { zones } = useZones();
	const { crops } = useCrops();
	const { thresholds } = useThresholds();
	const [alerts, setAlerts]   = useState([]);

	const [inventory, setInventory] = useState([]);

	useEffect(() => {
		alertService.listAlerts().then((d) => setAlerts(Array.isArray(d) ? d : (d.content ?? []))).catch(() => {});
		inventoryService.listItems().then((d) => setInventory(Array.isArray(d) ? d : (d.content ?? []))).catch(() => {});
	}, []);

	const [users, setUsers]           = useState([]);
const [loadingUsers, setLoading]  = useState(true);
const [userError, setUserError]   = useState("");
const [saving, setSaving]         = useState(false);
const [createForm, setCreate]     = useState(EMPTY_FORM);
const [editingId, setEditingId]   = useState(null);
const [editForm, setEditForm]     = useState({ fullName: "", email: "", role: "VIEWER" });

const sortedUsers = useMemo(
() => [...users].sort((a, b) => Number(b.active) - Number(a.active) || a.id - b.id),
[users]
);

const loadUsers = async () => {
setLoading(true);
setUserError("");
try {
const res = await userService.listUsers();
setUsers(Array.isArray(res) ? res : (res.content ?? []));
} catch (err) {
		if (!err.response) setUserError("Sin conexión con el servidor");
		else setUserError(err.message ?? "Error al cargar usuarios");
} finally {
setLoading(false);
}
};

useEffect(() => { loadUsers(); }, []);

const handleCreate = async (e) => {
e.preventDefault();
if (!isStrongPassword(createForm.password)) {
setUserError("Contraseña: mínimo 8 caracteres, mayúsculas, minúsculas y números.");
return;
}
setSaving(true); setUserError("");
try {
await userService.createUser(createForm);
setCreate(EMPTY_FORM);
await loadUsers();
} catch (err) {
if (!err.response) {
const newU = { ...createForm, id: Date.now(), active: true };
setUsers((prev) => [...prev, newU]);
setCreate(EMPTY_FORM);
} else {
setUserError(err.message ?? "Error al crear usuario");
}
} finally {
setSaving(false);
}
};

const startEdit = (u) => { setEditingId(u.id); setEditForm({ fullName: u.fullName, email: u.email, role: u.role }); };
const cancelEdit = () => { setEditingId(null); };

const saveEdit = async () => {
if (Number(editingId) === Number(auth.userId) && editForm.role !== auth.role) {
setUserError("No puedes cambiar tu propio rol."); return;
}
setSaving(true); setUserError("");
try {
await userService.updateUser(editingId, editForm);
setUsers((prev) => prev.map((u) => u.id === editingId ? { ...u, ...editForm } : u));
cancelEdit();
} catch (err) {
if (!err.response) { setUsers((prev) => prev.map((u) => u.id === editingId ? { ...u, ...editForm } : u)); cancelEdit(); }
else setUserError(err.message ?? "Error al guardar");
} finally {
setSaving(false);
}
};

const toggleStatus = async (user) => {
if (Number(user.id) === Number(auth.userId)) { setUserError("No puedes desactivar tu propia cuenta."); return; }
setSaving(true);
try {
await userService.updateUserStatus(user.id, !user.active);
setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, active: !u.active } : u));
} catch (err) {
if (!err.response) setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, active: !u.active } : u));
else setUserError(err.message ?? "Error");
} finally {
setSaving(false);
}
};

// ── stats ──
const activeZones  = zones.filter((z) => z.isActive).length;
		const activeCrops  = crops.filter((c) => c.status !== "HARVESTED").length;
		const critAlerts   = alerts.filter((a) => a.severity === "CRITICAL" || a.severity === "WARNING").length;
		const lowStock     = inventory.filter((i) => i.quantity <= i.minStock).length;

// ── input style shared ──
const inp = "w-full rounded-lg border border-[#d6e8d0] bg-white px-3 py-2 text-sm text-[#1b4f2f] outline-none focus:border-[#2f7f3c] focus:ring-1 focus:ring-[#2f7f3c]";

return (
<div className="flex gap-0 rounded-2xl border border-[#d6e8d0] bg-white overflow-hidden min-h-[600px]">
{/* ── nav lateral ── */}
<nav className="w-52 shrink-0 border-r border-[#d6e8d0] bg-[#f9fcf8] p-4">
<p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-[#9dbaa5]">
Panel admin
</p>
<div className="space-y-0.5">
{SECTIONS.map((s) => (
<button
key={s.key}
onClick={() => setActive(s.key)}
className={
"w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition " +
(active === s.key
? "bg-[#2f7f3c] text-white"
: "text-[#3a5745] hover:bg-[#e9f5e6]")
}
>
{s.label}
</button>
))}
</div>
</nav>

{/* ── contenido ── */}
<div className="flex-1 overflow-y-auto p-6 space-y-6">

{/* ══ RESUMEN ══════════════════════════════════════════════════ */}
{active === "resumen" && (
<>
<SectionTitle title="Resumen general" sub="Vista consolidada del estado del sistema" />

<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
<StatCard label="Zonas activas"     value={activeZones}  sub={MOCK_ZONES.length + " totales"} valueColor="text-[#2f7f3c]" />
<StatCard label="Cultivos activos"  value={activeCrops}  sub={MOCK_CROPS.length + " totales"} valueColor="text-[#1b4f2f]" />
<StatCard label="Alertas activas"   value={critAlerts}   sub="críticas o advertencias" valueColor={critAlerts > 0 ? "text-[#b43a2f]" : "text-[#2f7f3c]"} />
<StatCard label="Stock bajo"        value={lowStock}     sub="items por reabastecer" valueColor={lowStock > 0 ? "text-[#9f6b3d]" : "text-[#2f7f3c]"} />
</div>

{/* Zonas resumen */}
<div>
<h3 className="mb-3 font-heading text-sm font-bold text-[#1b4f2f]">Estado de zonas</h3>
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
{zones.map((z) => (
<div key={z.id} className="rounded-xl border border-[#d6e8d0] bg-[#f9fcf8] p-4">
<div className="flex items-center gap-2 mb-1">
<span className={"h-2 w-2 rounded-full " + (z.isActive ? "bg-[#2f7f3c]" : "bg-[#ccc]")} />
<p className="text-xs font-semibold text-[#1b4f2f] truncate">{z.name}</p>
</div>
<p className="text-[10px] text-[#9dbaa5] truncate">{z.description}</p>
<Badge cls={z.isActive ? "bg-[#e9f5e6] text-[#2f7f3c] mt-2" : "bg-[#f0f0f0] text-[#999] mt-2"}>
{z.isActive ? "Activa" : "Inactiva"}
</Badge>
</div>
))}
</div>
</div>

{/* Alertas recientes */}
{alerts.length > 0 && (
<div>
<h3 className="mb-3 font-heading text-sm font-bold text-[#1b4f2f]">Alertas recientes</h3>
<div className="space-y-2">
{alerts.slice(0, 3).map((a) => (
<div key={a.id} className="flex items-center justify-between rounded-xl border border-[#d6e8d0] bg-white px-4 py-3">
<div className="flex items-center gap-3">
<Badge cls={SEVERITY_COLORS[a.severity] ?? "bg-gray-100 text-gray-600"}>
{a.severity}
</Badge>
<span className="text-sm text-[#1b4f2f]">{a.message}</span>
</div>
<span className="text-xs text-[#9dbaa5]">{a.zone}</span>
</div>
))}
</div>
</div>
)}

{/* Cultivos por estado */}
<div>
<h3 className="mb-3 font-heading text-sm font-bold text-[#1b4f2f]">Cultivos por estado</h3>
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
{Object.entries(STATUS_CROP).map(([key, cfg]) => {
const count = crops.filter((c) => c.status === key).length;
return (
<div key={key} className="rounded-xl border border-[#d6e8d0] bg-[#f9fcf8] p-4 text-center">
<p className={"font-heading text-2xl font-bold " + cfg.cls.split(" ")[1]}>{count}</p>
<p className="mt-1 text-xs text-[#9dbaa5]">{cfg.label}</p>
</div>
);
})}
</div>
</div>
</>
)}

{/* ══ ZONAS ═════════════════════════════════════════════════════ */}
{active === "zonas" && (
<>
<SectionTitle title="Gestión de zonas" sub={"Total: " + zones.length + " zonas registradas"} />
<TableWrap>
<thead className="border-b border-[#d6e8d0] bg-[#f9fcf8]">
<tr><Th>Nombre</Th><Th>Descripción</Th><Th>Estado</Th><Th>Creada</Th></tr>
</thead>
<tbody>
{zones.map((z, i) => (
<tr key={z.id} className={"border-b border-[#e9f5e6] " + (i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")}>
<Td><span className="font-semibold text-[#1b4f2f]">{z.name}</span></Td>
<Td className="text-[#6b8f72]">{z.description}</Td>
<Td>
<Badge cls={z.isActive ? "bg-[#e9f5e6] text-[#2f7f3c]" : "bg-[#f0f0f0] text-[#999]"}>
{z.isActive ? "Activa" : "Inactiva"}
</Badge>
</Td>
<Td className="text-[#9dbaa5]">{new Date(z.createdAt).toLocaleDateString("es")}</Td>
</tr>
))}
</tbody>
</TableWrap>
</>
)}

{/* ══ CULTIVOS ══════════════════════════════════════════════════ */}
{active === "cultivos" && (
<>
<SectionTitle title="Cultivos y estado" sub={"Total: " + crops.length + " cultivos registrados"} />
<TableWrap>
<thead className="border-b border-[#d6e8d0] bg-[#f9fcf8]">
<tr><Th>Cultivo</Th><Th>Variedad</Th><Th>Zona</Th><Th>Plantas</Th><Th>Siembra</Th><Th>Estado</Th></tr>
</thead>
<tbody>
{crops.map((c, i) => {
const st = STATUS_CROP[c.status] ?? { label: c.status, cls: "bg-gray-100 text-gray-600" };
return (
<tr key={c.id} className={"border-b border-[#e9f5e6] " + (i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")}>
<Td><span className="font-semibold text-[#1b4f2f]">{c.name}</span></Td>
<Td className="text-[#6b8f72]">{c.variety}</Td>
<Td className="text-[#6b8f72]">{c.zoneName}</Td>
<Td>{c.plantCount}</Td>
<Td className="text-[#9dbaa5]">{new Date(c.sowingDate).toLocaleDateString("es")}</Td>
<Td><Badge cls={st.cls}>{st.label}</Badge></Td>
</tr>
);
})}
</tbody>
</TableWrap>
</>
)}

{/* ══ UMBRALES ══════════════════════════════════════════════════ */}
{active === "umbrales" && (
<>
<SectionTitle title="Umbrales configurados" sub={"Total: " + thresholds.length + " umbrales activos"} />
<TableWrap>
<thead className="border-b border-[#d6e8d0] bg-[#f9fcf8]">
<tr><Th>Zona</Th><Th>Variable</Th><Th>Min</Th><Th>Max</Th><Th>Unidad</Th></tr>
</thead>
<tbody>
{thresholds.map((t, i) => (
<tr key={t.id} className={"border-b border-[#e9f5e6] " + (i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")}>
<Td className="font-semibold text-[#1b4f2f]">{t.zoneName}</Td>
<Td>
<Badge cls="bg-[#e9f5e6] text-[#2f7f3c]">
{VAR_NAMES[t.variable] ?? t.variable}
</Badge>
</Td>
<Td>{t.minValue}</Td>
<Td>{t.maxValue}</Td>
<Td className="text-[#9dbaa5]">{t.unit}</Td>
</tr>
))}
</tbody>
</TableWrap>
</>
)}

{/* ══ ALERTAS ═══════════════════════════════════════════════════ */}
{active === "alertas" && (
<>
<div className="flex items-center justify-between">
<SectionTitle title="Gestión de alertas" sub={alerts.length + " alertas activas"} />
{alerts.length > 0 && (
<button
onClick={() => setAlerts([])}
className="rounded-lg bg-[#e9f5e6] px-4 py-2 text-sm font-semibold text-[#2f7f3c] transition hover:bg-[#d0e5c9]"
>
Resolver todas
</button>
)}
</div>
{alerts.length === 0 ? (
<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-10 text-center">
<p className="font-heading text-lg font-semibold text-[#2f7f3c]">Sin alertas activas</p>
<p className="mt-1 text-sm text-[#9dbaa5]">El sistema opera con normalidad</p>
</div>
) : (
<TableWrap>
<thead className="border-b border-[#d6e8d0] bg-[#f9fcf8]">
<tr><Th>Severidad</Th><Th>Variable</Th><Th>Zona</Th><Th>Valor</Th><Th>Mensaje</Th><Th>Accion</Th></tr>
</thead>
<tbody>
{alerts.map((a, i) => (
<tr key={a.id} className={"border-b border-[#e9f5e6] " + (i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")}>
<Td><Badge cls={SEVERITY_COLORS[a.severity] ?? "bg-gray-100 text-gray-600"}>{a.severity}</Badge></Td>
<Td className="text-[#6b8f72]">{VAR_NAMES[a.variableName] ?? a.variableName}</Td>
<Td className="font-semibold text-[#1b4f2f]">{a.zone}</Td>
<Td>{a.value} {a.unit}</Td>
<Td className="text-[#6b8f72] max-w-xs truncate">{a.message}</Td>
<Td>
<button
onClick={() => setAlerts((prev) => prev.filter((x) => x.id !== a.id))}
className="rounded-lg bg-[#e9f5e6] px-3 py-1 text-xs font-semibold text-[#2f7f3c] transition hover:bg-[#d0e5c9]"
>
Resolver
</button>
</Td>
</tr>
))}
</tbody>
</TableWrap>
)}
</>
)}

{/* ══ INVENTARIO ════════════════════════════════════════════════ */}
{active === "inventario" && (
<>
<SectionTitle title="Inventario del sistema" sub={inventory.length + " items registrados"} />
<TableWrap>
<thead className="border-b border-[#d6e8d0] bg-[#f9fcf8]">
<tr><Th>Nombre</Th><Th>Categoria</Th><Th>Cantidad</Th><Th>Stock min.</Th><Th>Estado</Th></tr>
</thead>
<tbody>
{inventory.map((item, i) => {
const isLow = item.quantity <= item.minStock;
return (
<tr key={item.id} className={"border-b border-[#e9f5e6] " + (i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")}>
<Td className="font-semibold text-[#1b4f2f]">{item.name}</Td>
<Td>
<Badge cls="bg-[#f0f4ff] text-[#3d5f9f]">
{CATEGORY_LABELS[item.category] ?? item.category}
</Badge>
</Td>
<Td>{item.quantity} {item.unit}</Td>
<Td className="text-[#9dbaa5]">{item.minStock} {item.unit}</Td>
<Td>
<Badge cls={isLow ? "bg-[#fbe8e5] text-[#b43a2f]" : "bg-[#e9f5e6] text-[#2f7f3c]"}>
{isLow ? "Stock bajo" : "OK"}
</Badge>
</Td>
</tr>
);
})}
</tbody>
</TableWrap>
</>
)}

{/* ══ USUARIOS ══════════════════════════════════════════════════ */}
{active === "usuarios" && (
<>
<SectionTitle title="Gestión de usuarios" sub="Crear, editar y administrar cuentas del sistema" />

{/* Formulario crear */}
<div className="rounded-2xl border border-[#d6e8d0] bg-[#f9fcf8] p-5">
<h3 className="mb-4 font-heading text-sm font-bold text-[#1b4f2f]">Nuevo usuario</h3>
<form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" onSubmit={handleCreate}>
<input className={inp} placeholder="Nombre completo" required value={createForm.fullName}
onChange={(e) => setCreate((p) => ({ ...p, fullName: e.target.value }))} />
<input className={inp} type="email" placeholder="Email" required value={createForm.email}
onChange={(e) => setCreate((p) => ({ ...p, email: e.target.value }))} />
<input className={inp} type="password" placeholder="Contraseña" required value={createForm.password}
onChange={(e) => setCreate((p) => ({ ...p, password: e.target.value }))} />
<select className={inp} value={createForm.role}
onChange={(e) => setCreate((p) => ({ ...p, role: e.target.value }))}>
{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
</select>
<button type="submit" disabled={saving}
className="rounded-lg bg-[#2f7f3c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1b4f2f] disabled:opacity-50">
{saving ? "..." : "Crear"}
</button>
</form>
{userError && (
<p className="mt-3 text-xs font-semibold text-[#b43a2f]">{userError}</p>
)}
</div>

{/* Tabla */}
{loadingUsers ? (
<p className="text-sm text-[#9dbaa5]">Cargando usuarios...</p>
) : (
<TableWrap>
<thead className="border-b border-[#d6e8d0] bg-[#f9fcf8]">
<tr><Th>Nombre</Th><Th>Email</Th><Th>Rol</Th><Th>Estado</Th><Th>Acciones</Th></tr>
</thead>
<tbody>
{sortedUsers.map((u, i) => {
const isEditing = editingId === u.id;
const isSelf = Number(u.id) === Number(auth.userId);
return (
<tr key={u.id} className={"border-b border-[#e9f5e6] " + (i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")}>
<Td>
{isEditing
? <input className={inp} value={editForm.fullName} onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))} />
: <span className="font-semibold text-[#1b4f2f]">{u.fullName}</span>}
</Td>
<Td>
{isEditing
? <input className={inp} type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} />
: <span className="text-[#6b8f72]">{u.email}</span>}
</Td>
<Td>
{isEditing
? (
<select className={inp} value={editForm.role} disabled={isSelf}
onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}>
{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
</select>
)
: <Badge cls={ROLE_COLORS[u.role] ?? "bg-gray-100 text-gray-600"}>{ROLE_LABELS[u.role] ?? u.role}</Badge>}
</Td>
<Td>
<button disabled={isSelf || saving}
onClick={() => toggleStatus(u)}
className={"rounded-full px-3 py-1 text-xs font-bold transition " +
(u.active ? "bg-[#e9f5e6] text-[#2f7f3c] hover:bg-[#d0e5c9]" : "bg-[#fbe8e5] text-[#b43a2f] hover:bg-[#f5d9d5]") +
(isSelf || saving ? " opacity-50 cursor-not-allowed" : "")}>
{u.active ? "Activo" : "Inactivo"}
</button>
</Td>
<Td>
<div className="flex gap-2">
{isEditing ? (
<>
<button onClick={saveEdit} disabled={saving}
className="rounded-lg bg-[#2f7f3c] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#1b4f2f] disabled:opacity-50">
Guardar
</button>
<button onClick={cancelEdit}
className="rounded-lg border border-[#d6e8d0] px-3 py-1 text-xs font-semibold text-[#6b8f72] transition hover:bg-[#f0f7f0]">
Cancelar
</button>
</>
) : (
<button onClick={() => startEdit(u)}
className="rounded-lg border border-[#d6e8d0] px-3 py-1 text-xs font-semibold text-[#3a5745] transition hover:bg-[#e9f5e6]">
Editar
</button>
)}
</div>
</Td>
</tr>
);
})}
</tbody>
</TableWrap>
)}
</>
)}

{/* ══ AUDITORIA ══════════════════════════════════════════════════ */}
{active === "auditoria" && (
<>
<SectionTitle title="Registro de auditoria" sub="Historial de acciones realizadas en el sistema" />
<TableWrap>
<thead className="border-b border-[#d6e8d0] bg-[#f9fcf8]">
<tr><Th>Usuario</Th><Th>Accion</Th><Th>Detalle</Th><Th>Fecha</Th></tr>
</thead>
<tbody>
{MOCK_AUDIT.map((entry, i) => (
<tr key={entry.id} className={"border-b border-[#e9f5e6] " + (i % 2 === 0 ? "bg-white" : "bg-[#fafaf9]")}>
<Td className="font-semibold text-[#1b4f2f]">{entry.user}</Td>
<Td>
<Badge cls="bg-[#f0f4ff] text-[#3d5f9f]">{entry.action}</Badge>
</Td>
<Td className="text-[#6b8f72]">{entry.detail}</Td>
<Td className="text-[#9dbaa5]">
{entry.ts.toLocaleDateString("es", { day: "2-digit", month: "short" })}
{" "}
{entry.ts.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
</Td>
</tr>
))}
</tbody>
</TableWrap>
</>
)}

</div>
</div>
);
}

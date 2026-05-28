import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useZones } from "../../hooks/useZones";
import { useCrops } from "../../hooks/useCrops";
import { useThresholds } from "../../hooks/useThresholds";
import { useAlerts } from "../../hooks/useAlerts";
const ROLES = ["ADMIN", "MANAGER", "TECHNICIAN", "VIEWER"];

const ROLE_LABELS = {
ADMIN: "Administrador",
MANAGER: "Gestor",
TECHNICIAN: "Técnico",
VIEWER: "Visualizador",
};

const ROLE_COLORS = {
	ADMIN:      "bg-[#fff7e0] text-[#b5a16a]", // dorado premium
	MANAGER:    "bg-[#f5f3e7] text-primary-700", // beige premium
	TECHNICIAN: "bg-primary-100 text-primary-700",
	VIEWER:     "bg-[#f5f3e7] text-primary-700", // beige premium
};

const STATUS_CROP = {
	ACTIVE:   { label: "Activo",      cls: "bg-primary-100 text-primary-700" },
	HARVEST:  { label: "Cosechando",  cls: "bg-[#fff7e0] text-[#b5a16a]" },
	FINISHED: { label: "Finalizado",  cls: "bg-[#f5f3e7] text-[#b5a16a]" },
};

const SEVERITY_COLORS = {
	CRITICAL: "bg-[#fff7e0] text-[#b5a16a]",
	WARNING:  "bg-[#f5f3e7] text-primary-700",
	INFO:     "bg-[#f5f3e7] text-primary-700",
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

const ACTUATOR_HISTORY_KEY = "invernadero_actuator_history";

const SECTIONS = [
{ key: "resumen",    label: "Resumen general" },
{ key: "zonas",      label: "Zonas" },
{ key: "cultivos",   label: "Cultivos" },
{ key: "umbrales",   label: "Umbrales" },
{ key: "usuarios",   label: "Usuarios" },
{ key: "auditoria",  label: "Auditoria" },
];

// --- helpers -----------------------------------------------------------------

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
			<h2 className="font-heading text-2xl font-bold text-primary-900">{title}</h2>
			{sub && <p className="mt-1 text-base text-primary-700/80">{sub}</p>}
		</div>
	);
}

function StatCard({ label, value, sub, valueColor }) {
	return (
			<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-5">
			<p className="text-[10px] font-bold uppercase tracking-widest text-primary-700/70">{label}</p>
			<p className={"mt-1 font-heading text-3xl font-bold " + (valueColor ?? "text-primary-700")}>{value}</p>
			{sub && <p className="mt-0.5 text-xs text-primary-700/60">{sub}</p>}
		</div>
	);
}

function Th({ children }) {
	return <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-primary-700/70">{children}</th>;
}

function Td({ children, className }) {
return <td className={"px-4 py-3 text-sm " + (className ?? "")}>{children}</td>;
}

function TableWrap({ children }) {
	return (
		<div className="overflow-x-auto rounded-2xl border border-[#e5e0c3] bg-white/90">
			<table className="w-full">{children}</table>
		</div>
	);
}

function isStrongPassword(pw) {
return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw);
}

const EMPTY_FORM = { fullName: "", email: "", password: "", role: "VIEWER" };

// --- componente principal -----------------------------------------------------

export default function Backoffice() {
const { auth } = useAuth();
const [active, setActive]   = useState("resumen");
const { zones } = useZones();
	const { crops } = useCrops();
	const zoneIds = zones.map(z => z.id);
	const { thresholds } = useThresholds(zoneIds);
	const { alerts } = useAlerts();
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

const auditEntries = useMemo(() => {
	const parseDate = (value) => {
		if (!value) return null;
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? null : d;
	};

	const isSameMoment = (a, b) => {
		if (!a || !b) return false;
		return Math.abs(a.getTime() - b.getTime()) < 1000;
	};

	const timeline = [];

	users.forEach((u) => {
		const created = parseDate(u.createdAt);
		const updated = parseDate(u.updatedAt);

		if (created) {
			timeline.push({
				id: `usr-c-${u.id}`,
				user: u.fullName || "Sistema",
				action: "Usuario creado",
				detail: `${u.email} (${u.role})`,
				ts: created,
			});
		}

		if (updated && !isSameMoment(created, updated)) {
			timeline.push({
				id: `usr-u-${u.id}`,
				user: u.fullName || "Sistema",
				action: "Usuario actualizado",
				detail: `${u.email} · ${u.active ? "Activo" : "Inactivo"}`,
				ts: updated,
			});
		}
	});

	zones.forEach((z) => {
		const created = parseDate(z.createdAt);
		const updated = parseDate(z.updatedAt);

		if (created) {
			timeline.push({
				id: `zon-c-${z.id}`,
				user: "Sistema",
				action: "Zona creada",
				detail: z.name,
				ts: created,
			});
		}

		if (updated && !isSameMoment(created, updated)) {
			timeline.push({
				id: `zon-u-${z.id}`,
				user: "Sistema",
				action: "Zona actualizada",
				detail: `${z.name} · ${(z.isActive ?? z.active) ? "Activa" : "Inactiva"}`,
				ts: updated,
			});
		}
	});

	crops.forEach((c) => {
		const created = parseDate(c.createdAt);
		const updated = parseDate(c.updatedAt);

		if (created) {
			timeline.push({
				id: `crp-c-${c.id}`,
				user: "Sistema",
				action: "Cultivo creado",
				detail: `${c.name} · ${c.zoneName}`,
				ts: created,
			});
		}

		if (updated && !isSameMoment(created, updated)) {
			timeline.push({
				id: `crp-u-${c.id}`,
				user: "Sistema",
				action: "Cultivo actualizado",
				detail: `${c.name} · Estado ${c.status}`,
				ts: updated,
			});
		}
	});

	thresholds.forEach((t) => {
		const updated = parseDate(t.updatedAt);
		if (!updated) return;

		timeline.push({
			id: `thr-u-${t.id}`,
			user: "Sistema",
			action: "Umbral actualizado",
			detail: `${VAR_NAMES[t.name] ?? t.name} · Zona ${t.zoneId}`,
			ts: updated,
		});
	});

	alerts.forEach((a) => {
		const created = parseDate(a.createdAt);
		const attended = parseDate(a.attendedAt);

		if (created) {
			timeline.push({
				id: `alt-c-${a.id}`,
				user: "Motor de alertas",
				action: "Alerta generada",
				detail: `${a.variableName} · ${a.severity} · Zona ${a.zoneId}`,
				ts: created,
			});
		}

		if (attended) {
			timeline.push({
				id: `alt-a-${a.id}`,
				user: "Operador",
				action: "Alerta atendida",
				detail: `${a.variableName} · Zona ${a.zoneId}`,
				ts: attended,
			});
		}
	});

	try {
		const raw = localStorage.getItem(ACTUATOR_HISTORY_KEY);
		const actuatorHistory = raw ? JSON.parse(raw) : [];
		if (Array.isArray(actuatorHistory)) {
			actuatorHistory.forEach((entry, idx) => {
				const ts = parseDate(entry.sentAt);
				if (!ts) return;
				timeline.push({
					id: `act-${idx}-${entry.sentAt}`,
					user: auth?.fullName || auth?.email || "Operador",
					action: entry.ok ? "Comando actuador" : "Error comando actuador",
					detail: `${entry.actuatorName} · ${entry.action} · ${entry.zoneName}`,
					ts: ts,
				});
			});
		}
	} catch {
		// Ignore invalid local history cache.
	}

	return timeline
		.sort((a, b) => b.ts.getTime() - a.ts.getTime())
		.slice(0, 120);
}, [users, zones, crops, thresholds, alerts, auth?.fullName, auth?.email]);

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

// -- stats --
		const activeZones  = zones.filter((z) => z.isActive ?? z.active).length;
		const activeCrops  = crops.filter((c) => c.status !== "HARVESTED").length;
		const critAlerts   = 0;
		const lowStock     = 0;

// -- input style shared --
const inp = "w-full rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-primary-900 text-sm outline-none transition focus:border-primary-600 focus:ring-1 focus:ring-primary-200/40";

return (
<div className="space-y-6">
{/* -- tabs horizontales -- */}
<div className="flex flex-wrap gap-1 border-b border-[#e5e0c3] pb-1">
{SECTIONS.map((s) => (
<button
key={s.key}
onClick={() => setActive(s.key)}
className={
"rounded-lg px-4 py-2 text-sm font-medium transition " +
(active === s.key
? "bg-primary-600 text-white hover:bg-primary-700"
: "text-primary-900 hover:bg-[#f5eedc] hover:text-primary-700")
}
>
{s.label}
</button>
))}
</div>

{/* -- contenido -- */}
<div className="space-y-6">

{/* -- RESUMEN -------------------------------------------------- */}
{active === "resumen" && (
<>
<SectionTitle title="Resumen general" sub="Vista consolidada del estado del sistema" />

<div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
<StatCard label="Zonas activas"     value={activeZones}  sub={zones.length + " totales"} valueColor="text-primary-700" />
<StatCard label="Cultivos activos"  value={activeCrops}  sub={crops.length + " totales"} valueColor="text-primary-700" />
</div>

{/* Zonas resumen */}
<div>
<h3 className="mb-3 font-heading text-sm font-bold text-zinc-900">Estado de zonas</h3>
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
{zones.map((z) => (
<div key={z.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
<div className="flex items-center gap-2 mb-1">
<span className={"h-2 w-2 rounded-full " + ((z.isActive ?? z.active) ? "bg-primary-700" : "bg-zinc-400")} />
<p className="text-xs font-semibold text-zinc-900 truncate">{z.name}</p>
</div>
<p className="text-[10px] text-zinc-500 truncate">{z.description}</p>
<Badge cls={(z.isActive ?? z.active) ? "bg-primary-100 text-primary-700 mt-2" : "bg-zinc-100 text-zinc-600 mt-2"}>
{(z.isActive ?? z.active) ? "Activa" : "Inactiva"}
</Badge>
</div>
))}
</div>
</div>

{/* Cultivos por estado */}
<div>
<h3 className="mb-3 font-heading text-sm font-bold text-zinc-900">Cultivos por estado</h3>
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
{Object.entries(STATUS_CROP).map(([key, cfg]) => {
const count = crops.filter((c) => c.status === key).length;
return (
<div key={key} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
<p className={"font-heading text-2xl font-bold " + cfg.cls.split(" ")[1]}>{count}</p>
<p className="mt-1 text-xs text-zinc-500">{cfg.label}</p>
</div>
);
})}
</div>
</div>
</>
)}

{/* -- ZONAS ----------------------------------------------------- */}
{active === "zonas" && (
<>
<SectionTitle title="Gestión de zonas" sub={"Total: " + zones.length + " zonas registradas"} />
<TableWrap>
<thead className="border-b border-zinc-200 bg-zinc-50">
<tr><Th>Nombre</Th><Th>Descripción</Th><Th>Estado</Th><Th>Creada</Th></tr>
</thead>
<tbody>
{zones.map((z, i) => (
<tr key={z.id} className={"border-b border-zinc-200 " + (i % 2 === 0 ? "bg-white" : "bg-zinc-50")}>
<Td><span className="font-semibold text-zinc-900">{z.name}</span></Td>
<Td className="text-zinc-600">{z.description}</Td>
<Td>
<Badge cls={(z.isActive ?? z.active) ? "bg-primary-100 text-primary-700" : "bg-zinc-100 text-zinc-600"}>
{(z.isActive ?? z.active) ? "Activa" : "Inactiva"}
</Badge>
</Td>
				<Td className="text-zinc-500">{new Date(z.createdAt).toLocaleDateString("es")}</Td>
</tr>
))}
</tbody>
</TableWrap>
</>
)}

{/* -- CULTIVOS -------------------------------------------------- */}
{active === "cultivos" && (
<>
<SectionTitle title="Cultivos y estado" sub={"Total: " + crops.length + " cultivos registrados"} />
<TableWrap>
<thead className="border-b border-zinc-200 bg-zinc-50">
<tr><Th>Cultivo</Th><Th>Variedad</Th><Th>Zona</Th><Th>Plantas</Th><Th>Siembra</Th><Th>Estado</Th></tr>
</thead>
<tbody>
{crops.map((c, i) => {
const st = STATUS_CROP[c.status] ?? { label: c.status, cls: "bg-gray-100 text-gray-600" };
return (
<tr key={c.id} className={"border-b border-zinc-200 " + (i % 2 === 0 ? "bg-white" : "bg-zinc-50")}>
<Td><span className="font-semibold text-zinc-900">{c.name}</span></Td>
<Td className="text-zinc-600">{c.variety}</Td>
<Td className="text-zinc-600">{c.zoneName}</Td>
<Td>{c.plantCount}</Td>
<Td className="text-zinc-500">{new Date(c.sowingDate).toLocaleDateString("es")}</Td>
<Td><Badge cls={st.cls}>{st.label}</Badge></Td>
</tr>
);
})}
</tbody>
</TableWrap>
</>
)}

{/* -- UMBRALES -------------------------------------------------- */}
{active === "umbrales" && (
<>
<SectionTitle title="Umbrales configurados" sub={"Total: " + thresholds.length + " umbrales activos"} />
<TableWrap>
<thead className="border-b border-zinc-200 bg-zinc-50">
<tr><Th>Zona</Th><Th>Variable</Th><Th>Min</Th><Th>Max</Th><Th>Unidad</Th></tr>
</thead>
<tbody>
{thresholds.map((t, i) => (
<tr key={t.id} className={"border-b border-zinc-200 " + (i % 2 === 0 ? "bg-white" : "bg-zinc-50")}>
<Td className="font-semibold text-zinc-900">{zones.find(z => z.id === t.zoneId)?.name ?? `Zona ${t.zoneId}`}</Td>
<Td>
<Badge cls="bg-primary-100 text-primary-700">
{VAR_NAMES[t.name] ?? t.name}
</Badge>
</Td>
<Td>{t.minValue}</Td>
<Td>{t.maxValue}</Td>
<Td className="text-zinc-500">{t.unit}</Td>
</tr>
))}
</tbody>
</TableWrap>
</>
)}

{/* -- USUARIOS -------------------------------------------------- */}
{active === "usuarios" && (
<>
<SectionTitle title="Gestión de usuarios" sub="Crear, editar y administrar cuentas del sistema" />

{/* Formulario crear */}
<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-5">
<h3 className="mb-4 font-heading text-sm font-bold text-zinc-900">Nuevo usuario</h3>
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
className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50">
{saving ? "..." : "Crear"}
</button>
</form>
{userError && (
<p className="mt-3 text-xs font-semibold text-rose-700">{userError}</p>
)}
</div>

{/* Tabla */}
{loadingUsers ? (
<p className="text-sm text-zinc-500">Cargando usuarios...</p>
) : (
<TableWrap>
<thead className="border-b border-zinc-200 bg-zinc-50">
<tr><Th>Nombre</Th><Th>Email</Th><Th>Rol</Th><Th>Estado</Th><Th>Acciones</Th></tr>
</thead>
<tbody>
{sortedUsers.map((u, i) => {
const isEditing = editingId === u.id;
const isSelf = Number(u.id) === Number(auth.userId);
return (
<tr key={u.id} className={"border-b border-zinc-200 " + (i % 2 === 0 ? "bg-white" : "bg-zinc-50")}>
<Td>
{isEditing
? <input className={inp} value={editForm.fullName} onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))} />
: <span className="font-semibold text-zinc-900">{u.fullName}</span>}
</Td>
<Td>
{isEditing
? <input className={inp} type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} />
: <span className="text-zinc-600">{u.email}</span>}
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
(u.active ? "bg-primary-100 text-primary-700 hover:bg-primary-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200") +
(isSelf || saving ? " opacity-50 cursor-not-allowed" : "")}>
{u.active ? "Activo" : "Inactivo"}
</button>
</Td>
<Td>
<div className="flex gap-2">
{isEditing ? (
<>
<button onClick={saveEdit} disabled={saving}
className="rounded-lg bg-primary-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50">
Guardar
</button>
<button onClick={cancelEdit}
className="rounded-lg border border-[#e5e0c3] px-3 py-1 text-xs font-semibold text-primary-900 transition hover:bg-[#f5f3e7]">
Cancelar
</button>
</>
) : (
<button onClick={() => startEdit(u)}
className="rounded-lg border border-[#e5e0c3] px-3 py-1 text-xs font-semibold text-primary-900 transition hover:bg-primary-100">
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

{/* -- AUDITORIA -------------------------------------------------- */}
{active === "auditoria" && (
<>
<SectionTitle title="Registro de auditoria" sub="Eventos construidos con datos reales del backend y comandos de actuadores" />
) : (
{auditEntries.length === 0 ? (
<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-4 text-sm text-primary-700/60">
No hay eventos de auditoría disponibles todavía.
</div>
) : (
<TableWrap>
<thead className="border-b border-zinc-200 bg-zinc-50">
<tr><Th>Usuario</Th><Th>Accion</Th><Th>Detalle</Th><Th>Fecha</Th></tr>
</thead>
<tbody>
{auditEntries.map((entry, i) => (
<tr key={entry.id} className={"border-b border-zinc-200 " + (i % 2 === 0 ? "bg-white" : "bg-zinc-50")}>
<Td className="font-semibold text-zinc-900">{entry.user}</Td>
<Td>
<Badge cls="bg-sky-100 text-sky-700">{entry.action}</Badge>
</Td>
<Td className="text-zinc-600">{entry.detail}</Td>
<Td className="text-zinc-500">
{entry.ts.toLocaleDateString("es", { day: "2-digit", month: "short" })}
{" "}
{entry.ts.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
</Td>
</tr>
))}
</tbody>
</TableWrap>
)}
</>
)}

</div>
</div>
);
}


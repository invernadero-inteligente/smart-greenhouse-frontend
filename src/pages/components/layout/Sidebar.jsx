import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const PATHS = {
home: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
zones: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
crops: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
thresholds: "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75",
alerts: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
actuators: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
inventory: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
users: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
settings: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125",
logout: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
leaf: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
};

const ROLE_LABELS = {
ADMIN: "Administrador",
MANAGER: "Gestor",
TECHNICIAN: "Técnico",
VIEWER: "Visualizador",
};

const ROLE_BADGES = {
VIEWER: { label: "Solo lectura", cls: "bg-gray-100 text-gray-500" },
};

const NAV_ITEMS = [
{ to: "/panel", label: "Inicio", icon: "home" },
{ to: "/zonas", label: "Zonas", icon: "zones" },
{ to: "/cultivos", label: "Cultivos", icon: "crops" },
{ to: "/umbrales", label: "Umbrales", icon: "thresholds" },
];

function Icon({ name }) {
return (
<svg
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
strokeWidth={1.5}
stroke="currentColor"
className="h-[18px] w-[18px] shrink-0"
>
<path strokeLinecap="round" strokeLinejoin="round" d={PATHS[name] ?? ""} />
</svg>
);
}

function NavItem({ to, label, icon, badge, alertCount, onClick }) {
return (
<NavLink
to={to}
end={to === "/panel"}
onClick={onClick}
className={({ isActive }) =>
"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
(isActive
? "bg-[#2f7f3c] text-white"
: "text-[#3a5745] hover:bg-[#e9f5e6] hover:text-[#1b4f2f]")
}
>
<Icon name={icon} />
<span className="flex-1">{label}</span>
{badge === "alerts" && alertCount > 0 && (
<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b43a2f] px-1.5 text-[10px] font-bold text-white">
{alertCount}
</span>
)}
</NavLink>
);
}

function AdminNavItem({ to, label, icon, badge, onClick }) {
return (
<NavLink
to={to}
onClick={onClick}
className={({ isActive }) =>
"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
(isActive
? "bg-white/20 text-white"
: "text-[#a8cbb0] hover:bg-white/10 hover:text-white")
}
>
<Icon name={icon} />
<span className="flex-1">{label}</span>
{badge !== undefined && (
<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px] font-bold text-white">
{badge}
</span>
)}
</NavLink>
);
}

export default function Sidebar({ open, onClose }) {
const { auth, isAdmin, logout } = useAuth();
const navigate = useNavigate();

const displayName = auth.fullName || auth.email || "Usuario";
const initial = displayName[0].toUpperCase();
const roleBadge = ROLE_BADGES[auth.role];

const criticalAlerts = 0;
	const totalUsers = 0;
	const activeUsers = 0;

const handleLogout = () => {
logout();
navigate("/login");
};

return (
<aside
className={
"fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[#d6e8d0] bg-white transition-transform duration-300 lg:translate-x-0 " +
(open ? "translate-x-0 shadow-xl" : "-translate-x-full")
}
>
{/* Brand */}
<div className="flex items-center gap-3 border-b border-[#d6e8d0] px-5 py-5">
<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2f7f3c]">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="h-4 w-4">
<path strokeLinecap="round" strokeLinejoin="round" d={PATHS.leaf} />
</svg>
</div>
<div>
<p className="font-heading text-sm font-bold leading-tight text-[#1b4f2f]">Invernadero</p>
<p className="text-xs text-[#6b8f72]">Inteligente</p>
</div>
</div>

{/* User */}
<div className="border-b border-[#d6e8d0] px-5 py-4">
<div className="flex items-start gap-3">
<div className="relative">
<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9f5e6] font-heading text-sm font-bold text-[#2f7f3c]">
{initial}
</div>
{isAdmin && (
<span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#b43a2f]">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-2.5 w-2.5">
<path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM10 8a2 2 0 100 4 2 2 0 000-4zm-5.657 2.343a.75.75 0 010 1.06L3.28 12.47a.75.75 0 11-1.06-1.06l1.06-1.062a.75.75 0 011.06 0zm11.314 0a.75.75 0 011.06 0l1.062 1.061a.75.75 0 01-1.06 1.06l-1.062-1.06a.75.75 0 010-1.061zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zm-4.95-.05a.75.75 0 011.061 1.061L5.05 17.073a.75.75 0 01-1.06-1.06l1.06-1.062zm9.9 0l1.061 1.06a.75.75 0 11-1.06 1.062L13.89 15.95a.75.75 0 011.06-1.061z" clipRule="evenodd" />
</svg>
</span>
)}
</div>
<div className="min-w-0 flex-1">
<p className="truncate text-sm font-semibold text-[#1b4f2f]">{displayName}</p>
<p className="text-xs text-[#6b8f72]">{ROLE_LABELS[auth.role] || auth.role}</p>
{roleBadge && (
<span className={"mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold " + roleBadge.cls}>
{roleBadge.label}
</span>
)}
</div>
</div>
</div>

{/* Nav */}
<nav className="flex-1 overflow-y-auto px-3 py-4">
<div className="space-y-0.5">
{NAV_ITEMS.map((item) => (
<NavItem
key={item.to}
{...item}
alertCount={criticalAlerts}
onClick={onClose}
/>
))}
</div>

{/* Admin panel */}
{isAdmin && (
<div className="mt-5 overflow-hidden rounded-xl bg-[#1b4f2f]">
{/* Header */}
<div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="h-4 w-4 opacity-70">
<path strokeLinecap="round" strokeLinejoin="round" d={PATHS.shield} />
</svg>
<p className="text-xs font-bold uppercase tracking-widest text-[#9dbaa5]">
Administración
</p>
</div>

{/* Mini stats */}
<div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
<div>
<p className="text-[10px] text-[#9dbaa5]">Usuarios activos</p>
<p className="font-heading text-lg font-bold text-white">{activeUsers} <span className="text-xs font-normal text-[#9dbaa5]">de {totalUsers}</span></p>
</div>
<div className="text-right">
<p className="text-[10px] text-[#9dbaa5]">Alertas activas</p>
<p className={"font-heading text-lg font-bold " + (criticalAlerts > 0 ? "text-[#f87171]" : "text-[#86efac]")}>
{criticalAlerts}
</p>
</div>
</div>

{/* Status */}
<div className="flex items-center justify-between px-4 py-2">
<span className="text-[10px] text-[#9dbaa5]">Estado del sistema</span>
<span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#86efac]">
<span className="h-1.5 w-1.5 rounded-full bg-[#86efac]" />
Operativo
</span>
</div>

{/* Admin links */}
<div className="space-y-0.5 px-2 pb-2">
<AdminNavItem
to="/admin/usuarios"
label="Usuarios"
icon="users"
badge={totalUsers}
onClick={onClose}
/>
<AdminNavItem
to="/backoffice"
label="Configuracion"
icon="settings"
onClick={onClose}
/>
</div>
</div>
)}
</nav>

{/* Logout */}
<div className="border-t border-[#d6e8d0] px-3 py-4">
<button
onClick={handleLogout}
className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#b43a2f] transition-colors hover:bg-[#fbe8e5]"
>
<Icon name="logout" />
Cerrar sesion
</button>
</div>
</aside>
);
}

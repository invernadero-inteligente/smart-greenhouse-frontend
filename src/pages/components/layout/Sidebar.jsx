import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	AlertTriangle,
	Cpu,
	Gauge,
	LayoutDashboard,
	Leaf,
	LogOut,
	MapPinned,
	Package,
	Settings,
	SlidersHorizontal,
	Users
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useAlerts } from "../../../hooks/useAlerts";
import { cn } from "../../../lib/utils";


const ROLE_LABELS = {
	ADMIN: "Administrador",
	MANAGER: "Gestor",
	TECHNICIAN: "Técnico",
	VIEWER: "Visualizador"
};

const NAV_ITEMS = [
	{ to: "/panel", label: "Dashboard", icon: LayoutDashboard },
	{ to: "/zonas", label: "Zonas", icon: MapPinned },
	{ to: "/cultivos", label: "Cultivos", icon: Leaf },
	{ to: "/umbrales", label: "Umbrales", icon: SlidersHorizontal },
	{ to: "/alertas", label: "Alertas", icon: AlertTriangle, badge: "alerts" },
	{ to: "/actuadores", label: "Actuadores", icon: Cpu },
	{ to: "/inventario", label: "Inventario", icon: Package },
];


function NavItem({ to, label, icon: Icon, badge, onClick, alertCount }) {
	return (
		<NavLink
			to={to}
			end={to === "/panel"}
			onClick={onClick}
			className={({ isActive }) =>
				cn(
					"group flex items-center gap-3 rounded-2xl px-4 py-2.5 text-base font-medium transition-all duration-200 ease-in-out border border-transparent",
					isActive
						? "bg-[#0e544b] text-white border-[#09332e] shadow-md"
						: "bg-[#0e544b] text-white hover:bg-[#09332e] hover:text-white border-[#09332e] shadow"
				)
			}
			style={{ boxShadow: '0 2px 8px 0 rgba(44,79,61,0.04)' }}
		>
			<Icon className="h-5 w-5 shrink-0 text-white transition" />
			<span className="flex-1 tracking-tight">{label}</span>
			{badge === "alerts" && alertCount > 0 && (
				<span className="inline-flex min-w-5 items-center justify-center rounded-full border border-rose-300 bg-rose-100 px-1.5 text-[10px] font-semibold text-rose-600 animate-pulse">
					{alertCount}
				</span>
			)}
		</NavLink>
	);
}



export default function Sidebar({ open, onClose }) {
	const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
	const { auth, isAdmin, logout } = useAuth();
	const navigate = useNavigate();
	const { highAlerts } = useAlerts({ status: "OPEN" });

	useEffect(() => {
		const media = window.matchMedia("(min-width: 1024px)");
		const update = () => setIsDesktop(media.matches);
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, []);

	const displayName = auth.fullName || auth.email || "Usuario";
	const initial = displayName[0]?.toUpperCase() ?? "U";
	const criticalAlerts = highAlerts.length;

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<motion.aside
			initial={false}
			animate={{ x: isDesktop || open ? 0 : -320 }}
			transition={{ type: "spring", stiffness: 350, damping: 32 }}
			className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#e5e0c3] bg-white/80 px-4 pb-6 pt-6 backdrop-blur-2xl shadow-md lg:translate-x-0"
			style={{ boxShadow: '0 8px 32px 0 rgba(44,79,61,0.07)' }}
		>
			{/* Branding */}
			<div className="mb-6 flex items-center gap-3 rounded-3xl border border-[#e5e0c3] bg-white/90 p-4 shadow-sm">
				<div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
					<Gauge className="h-6 w-6" />
				</div>
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-emerald-600 font-semibold">Smart IoT</p>
					<p className="text-base font-bold text-zinc-900 leading-tight">Greenhouse Control</p>
				</div>
			</div>

			{/* User */}
			<div className="mb-6 rounded-3xl border border-[#e5e0c3] bg-white/90 p-4 flex items-center gap-3 shadow-sm">
				<div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-200 text-emerald-700 text-lg font-bold">
					{initial}
				</div>
				<div className="min-w-0">
					<p className="truncate text-base font-semibold text-zinc-900">{displayName}</p>
					<p className="text-xs text-emerald-600 font-medium">{ROLE_LABELS[auth.role] || auth.role}</p>
				</div>
			</div>

			{/* Navigation */}
						<nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
								{NAV_ITEMS.map((item) => (
										<NavItem key={item.to} {...item} alertCount={criticalAlerts} onClick={onClose} />
								))}

								{isAdmin && (
									<>
										   <NavLink
											   to="/reports"
											   onClick={onClose}
											   className={({ isActive }) =>
												   cn(
													   "mt-6 flex items-center gap-2 rounded-xl px-3 py-2 text-base font-medium transition-all border border-transparent",
													   isActive
														   ? "bg-[#0e544b] text-white border-[#09332e] shadow-md"
														   : "bg-[#0e544b] text-white hover:bg-[#09332e] hover:text-white border-[#09332e] shadow"
												   )
											   }
										   >
											   <Package className="h-5 w-5 text-white transition" />
											   Reportes
										   </NavLink>
										<div className="mt-4 rounded-2xl border border-[#e5e0c3] bg-white/90 p-3 shadow-sm">
											<p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-emerald-600 font-semibold">Admin</p>
											   <NavLink
												   to="/admin/usuarios"
												   onClick={onClose}
												   className={({ isActive }) =>
													   cn(
														   "mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-base font-medium transition-all border border-transparent",
														   isActive
															   ? "bg-[#0e544b] text-white border-[#09332e] shadow-md"
															   : "bg-[#0e544b] text-white hover:bg-[#09332e] hover:text-white border-[#09332e] shadow"
													   )
												   }
											   >
												   <Users className="h-5 w-5 text-white transition" />
												   Usuarios
											   </NavLink>
											   <NavLink
												   to="/backoffice"
												   onClick={onClose}
												   className={({ isActive }) =>
													   cn(
														   "flex items-center gap-2 rounded-xl px-3 py-2 text-base font-medium transition-all border border-transparent",
														   isActive
															   ? "bg-[#0e544b] text-white border-[#09332e] shadow-md"
															   : "bg-[#0e544b] text-white hover:bg-[#09332e] hover:text-white border-[#09332e] shadow"
													   )
												   }
											   >
												   <Settings className="h-5 w-5 text-white transition" />
												   Backoffice
											   </NavLink>
										</div>
									</>
								)}
						</nav>

			{/* Logout */}
			   <div className="mt-6 rounded-2xl border border-[#e5e0c3] bg-white/90 p-4 shadow-sm">
				   <button
					   onClick={handleLogout}
					   className="flex w-full items-center justify-between rounded-xl border border-[#09332e] bg-[#0e544b] px-3 py-2 text-base text-white font-semibold transition hover:bg-[#09332e] hover:text-white"
					   style={{ boxShadow: '0 1px 4px 0 rgba(44,79,61,0.08)' }}
				   >
					   <span className="flex items-center gap-2">
						   <LogOut className="h-5 w-5 text-white" />
						   Cerrar sesión
					   </span>
					   <span className="text-[11px] text-white">ESC</span>
				   </button>
			   </div>
		</motion.aside>
	);
}

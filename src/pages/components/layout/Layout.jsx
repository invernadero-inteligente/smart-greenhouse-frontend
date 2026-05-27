import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Menu, Search } from "lucide-react";
import { useAlerts } from "../../../hooks/useAlerts";
import { cn } from "../../../lib/utils";
import Sidebar from "./Sidebar";

export default function Layout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const { openAlerts } = useAlerts({ status: "OPEN" });

	const handleSearch = (event) => {
		event.preventDefault();
		const query = searchQuery.trim().toLowerCase();
		if (!query) return;

		const routes = [
			{ keywords: ["dashboard", "panel", "inicio"], to: "/panel" },
			{ keywords: ["zonas", "zona"], to: "/zonas" },
			{ keywords: ["cultivos", "cultivo"], to: "/cultivos" },
			{ keywords: ["umbrales", "umbral", "threshold"], to: "/umbrales" },
			{ keywords: ["alertas", "alerta", "alarma"], to: "/alertas" },
			{ keywords: ["actuadores", "actuador", "control"], to: "/actuadores" },
			{ keywords: ["inventario", "stock", "insumos"], to: "/inventario" },
			{ keywords: ["usuarios", "usuario", "admin"], to: "/admin/usuarios" },
			{ keywords: ["backoffice", "configuracion"], to: "/backoffice" }
		];

		const match = routes.find((item) => item.keywords.some((keyword) => query.includes(keyword)));
		if (match) {
			navigate(match.to);
			setSearchQuery("");
		}
	};

	const title = useMemo(() => {
		const route = location.pathname.split("/").filter(Boolean).at(0) ?? "panel";
		const labels = {
			panel: "Dashboard",
			zonas: "Zonas",
			cultivos: "Cultivos",
			umbrales: "Umbrales",
			alertas: "Alertas",
			actuadores: "Actuadores",
			inventario: "Inventario",
			admin: "Administración",
			backoffice: "Backoffice"
		};
		return labels[route] ?? "Panel";
	}, [location.pathname]);

	return (
		<div className="min-h-screen bg-background text-foreground transition-colors duration-200">
			{sidebarOpen && (
				<div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
			)}

			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			<div className="flex min-h-screen flex-1 flex-col lg:pl-72">
				<header className="sticky top-0 z-20 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur xl:px-8">
					<div className="flex items-center justify-between gap-3">
						<div className="flex min-w-0 items-center gap-3">
							<button
								onClick={() => setSidebarOpen(true)}
								className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:bg-card-muted lg:hidden"
								aria-label="Abrir menú"
							>
								<Menu className="h-5 w-5" />
							</button>
							<div className="min-w-0">
								<p className="truncate text-xs uppercase tracking-[0.2em] text-muted">Control Center</p>
								<h1 className="truncate text-base font-semibold sm:text-lg text-foreground">{title}</h1>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<form onSubmit={handleSearch} className="hidden md:block">
								<label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-foreground transition hover:border-primary/80">
									<Search className="h-4 w-4" />
									<input
										type="text"
										value={searchQuery}
										onChange={(event) => setSearchQuery(event.target.value)}
										placeholder="Buscar módulo..."
										className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
									/>
								</label>
							</form>
							<button
								onClick={() => navigate("/alertas")}
								className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:bg-card-muted"
								title="Ir a alertas"
							>
								<Bell className="h-5 w-5" />
								{openAlerts.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary-500" />}
							</button>
						</div>
					</div>
				</header>

				<motion.main
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.25, ease: "easeOut" }}
					className="flex-1 px-4 py-5 xl:px-8"
				>
					<Outlet />
				</motion.main>
			</div>
		</div>
	);
}


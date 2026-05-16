import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";

function linkClass({ isActive }) {
	return `rounded-xl px-3 py-2 text-sm font-semibold transition ${
		isActive ? "bg-[#2f7f3c] text-white" : "text-[#2c4f3d] hover:bg-[#edf4ec]"
	}`;
}

function Navbar() {
	const navigate = useNavigate();
	const { auth, isAdmin, logout } = useAuth();
	const [showMenu, setShowMenu] = useState(false);

	return (
		<header className="sticky top-0 z-20 border-b border-[#1b4f2f1f] bg-white/70 backdrop-blur-md">
			<div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
				<div>
					<p className="m-0 font-heading text-lg font-bold">Invernadero Inteligente</p>
					<p className="m-0 text-xs text-[#4d6b5a]">{auth.email}</p>
				</div>

				<nav className="flex flex-wrap items-center gap-2">
					<NavLink to="/panel" className={linkClass}>
						🏠 Panel
					</NavLink>
					<NavLink to="/zonas" className={linkClass}>
						📍 Zonas
					</NavLink>
					<NavLink to="/cultivos" className={linkClass}>
						🌾 Cultivos
					</NavLink>
					<NavLink to="/umbrales" className={linkClass}>
						⚙️ Umbrales
					</NavLink>
					<NavLink to="/alertas" className={linkClass}>
						⚠️ Alertas
					</NavLink>
					<NavLink to="/actuadores" className={linkClass}>
						💨 Actuadores
					</NavLink>
					<NavLink to="/inventario" className={linkClass}>
						📦 Inventario
					</NavLink>
					
					{isAdmin && (
						<div className="relative">
							<button
								onClick={() => setShowMenu(!showMenu)}
								className={linkClass({ isActive: showMenu })}
							>
								👤 Admin ▼
							</button>
							{showMenu && (
								<div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-[#d0e5c9] bg-white shadow-lg">
									<NavLink
										to="/admin/usuarios"
										className={({ isActive }) =>
											`block px-4 py-2 text-sm transition ${
												isActive
													? "bg-[#2f7f3c] text-white"
													: "text-[#2c4f3d] hover:bg-[#edf4ec]"
											}`
										}
										onClick={() => setShowMenu(false)}
									>
										Gestión de Usuarios
									</NavLink>
									<NavLink
										to="/backoffice"
										className={({ isActive }) =>
											`block px-4 py-2 text-sm transition ${
												isActive
													? "bg-[#2f7f3c] text-white"
													: "text-[#2c4f3d] hover:bg-[#edf4ec]"
											}`
										}
										onClick={() => setShowMenu(false)}
									>
										Backoffice
									</NavLink>
								</div>
							)}
						</div>
					)}

					<button
						type="button"
						className="rounded-xl bg-[#fbe8e5] px-3 py-2 text-sm font-semibold text-[#b43a2f] transition hover:-translate-y-0.5"
						onClick={() => {
							logout();
							navigate("/login");
						}}
					>
						Cerrar sesión
					</button>
				</nav>
			</div>
		</header>
	);
}

export default Navbar;

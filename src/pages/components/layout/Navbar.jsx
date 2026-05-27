import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";


function linkClass({ isActive }) {
	return `rounded-2xl px-4 py-2 text-base font-medium transition-all duration-200 ease-in-out border border-transparent ${
		isActive
			? "bg-primary-500/10 text-primary-700 border-primary-500/30 shadow-sm"
			: "bg-white/80 text-zinc-900 hover:bg-[#f5eedc] hover:text-primary-700 border-[#e5e0c3]"
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

										function Navbar() {
											const navigate = useNavigate();
											const { auth, isAdmin, logout } = useAuth();
											const [showMenu, setShowMenu] = useState(false);

											return (
												<header className="sticky top-0 z-30 border-b border-[#e5e0c3] bg-white/80 backdrop-blur-xl shadow-sm">
													<div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
														<div className="flex flex-col">
															<p className="font-heading text-xl font-bold text-primary-700 tracking-tight leading-tight">Invernadero Inteligente</p>
															<p className="text-xs text-primary-600 font-medium">{auth.email}</p>
														</div>

														<nav className="flex flex-wrap items-center gap-2">
															<NavLink to="/panel" className={linkClass}>
																Panel
															</NavLink>
															<NavLink to="/zonas" className={linkClass}>
																Zonas
															</NavLink>
															<NavLink to="/cultivos" className={linkClass}>
																Cultivos
															</NavLink>
															<NavLink to="/umbrales" className={linkClass}>
																Umbrales
															</NavLink>
															<NavLink to="/alertas" className={linkClass}>
																Alertas
															</NavLink>
															<NavLink to="/actuadores" className={linkClass}>
																Actuadores
															</NavLink>
															<NavLink to="/inventario" className={linkClass}>
																Inventario
															</NavLink>

															{isAdmin && (
																<div className="relative">
																	<button
																		onClick={() => setShowMenu(!showMenu)}
																		className={linkClass({ isActive: showMenu }) + " flex items-center gap-2"}
																	>
																		Admin
																		<span className="ml-1 text-xs">▼</span>
																	</button>
																	{showMenu && (
																		<div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-[#e5e0c3] bg-white/95 shadow-lg py-2 z-50 animate-fade-in">
																			<NavLink
																				to="/admin/usuarios"
																				className={({ isActive }) =>
																					`block rounded-xl px-4 py-2 text-base font-medium transition-all border border-transparent ${
																						isActive
																							? "bg-primary-500/10 text-primary-700 border-primary-500/30 shadow-sm"
																							: "bg-white/80 text-zinc-900 hover:bg-[#f5eedc] hover:text-primary-700 border-[#e5e0c3]"
																					}`
																				}
																				onClick={() => setShowMenu(false)}
																			>
																				Gestión de Usuarios
																			</NavLink>
																			<NavLink
																				to="/backoffice"
																				className={({ isActive }) =>
																					`block rounded-xl px-4 py-2 text-base font-medium transition-all border border-transparent ${
																						isActive
																							? "bg-primary-500/10 text-primary-700 border-primary-500/30 shadow-sm"
																							: "bg-white/80 text-zinc-900 hover:bg-[#f5eedc] hover:text-primary-700 border-[#e5e0c3]"
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
																className="rounded-2xl px-4 py-2 text-base font-semibold text-rose-600 bg-white/80 border border-transparent transition hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 ml-2"
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


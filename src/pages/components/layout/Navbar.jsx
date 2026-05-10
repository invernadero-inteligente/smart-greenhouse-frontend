import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

function linkClass({ isActive }) {
	return `rounded-xl px-3 py-2 text-sm font-semibold transition ${
		isActive ? "bg-[#2f7f3c] text-white" : "text-[#2c4f3d] hover:bg-[#edf4ec]"
	}`;
}

function Navbar() {
	const navigate = useNavigate();
	const { auth, isAdmin, logout } = useAuth();

	return (
		<header className="sticky top-0 z-20 border-b border-[#1b4f2f1f] bg-white/70 backdrop-blur-md">
			<div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
				<div>
					<p className="m-0 font-heading text-lg font-bold">Invernadero Inteligente</p>
					<p className="m-0 text-xs text-[#4d6b5a]">{auth.email}</p>
				</div>

				<nav className="flex flex-wrap items-center gap-2">
					<NavLink to="/panel" className={linkClass}>
						Panel
					</NavLink>
					{isAdmin ? (
						<NavLink to="/backoffice" className={linkClass}>
							Backoffice
						</NavLink>
					) : null}
					<button
						type="button"
						className="rounded-xl bg-[#fbe8e5] px-3 py-2 text-sm font-semibold text-[#b43a2f] transition hover:-translate-y-0.5"
						onClick={() => {
							logout();
							navigate("/login");
						}}
					>
						Cerrar sesion
					</button>
				</nav>
			</div>
		</header>
	);
}

export default Navbar;

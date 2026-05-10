import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import FutureModulesSlider from "../components/dashboard/FutureModulesSlider";

function Dashboard() {
	const { auth, isAdmin } = useAuth();

	return (
		<main className="mx-auto grid w-full max-w-6xl gap-5 p-6">
			<section className="rounded-3xl border border-[#1b4f2f1f] bg-white/80 p-7 shadow-[0_20px_60px_rgba(20,51,33,0.16)] backdrop-blur-md max-md:rounded-2xl max-md:p-5">
				<p className="font-heading text-xs uppercase tracking-[0.08em] text-[#4d6b5a]">Panel general</p>
				<h1 className="my-2 font-heading text-4xl leading-tight">Bienvenido, {auth.role}</h1>
				<p className="m-0 text-[#4d6b5a]">
					Este panel muestra opciones segun tu rol. Solo administradores pueden entrar al
					 backoffice de usuarios.
				</p>

				<div className="mt-6 flex flex-wrap gap-3">
					{isAdmin ? (
						<Link
							to="/backoffice"
							className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2f7f3c] to-[#1b4f2f] px-4 py-2.5 font-bold text-white shadow-[0_8px_24px_rgba(27,79,47,0.25)] transition hover:-translate-y-0.5"
						>
							Ir al backoffice
						</Link>
					) : (
						<span className="rounded-xl bg-[#edf4ec] px-4 py-2.5 font-semibold text-[#204b35]">
							Tu rol no incluye gestion de usuarios.
						</span>
					)}
				</div>
			</section>

			<FutureModulesSlider />
		</main>
	);
}

export default Dashboard;

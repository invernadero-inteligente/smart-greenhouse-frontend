import { Link } from "react-router-dom";

function NotFound() {
	return (
		<main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_20%_15%,#ffffff_0%,transparent_35%),linear-gradient(145deg,#f3efe6,#dbecd7)] p-6 font-body text-[#143321]">
			<section className="grid w-full max-w-xl gap-3.5 rounded-3xl border border-[#1b4f2f1f] bg-white/80 p-8 text-center shadow-[0_20px_60px_rgba(20,51,33,0.16)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500 max-md:rounded-2xl max-md:p-6">
				<h1 className="my-1 font-heading text-5xl leading-tight">404</h1>
				<p className="m-0 text-[#4d6b5a]">La pagina que buscas no existe.</p>
				<Link
					to="/"
					className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2f7f3c] to-[#1b4f2f] px-4 py-2.5 font-bold text-white shadow-[0_8px_24px_rgba(27,79,47,0.25)] transition hover:-translate-y-0.5"
				>
					Volver al inicio
				</Link>
			</section>
		</main>
	);
}

export default NotFound;

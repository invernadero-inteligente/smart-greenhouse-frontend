import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_20%_15%,#ffffff_0%,transparent_35%),linear-gradient(145deg,#f3efe6,#dbecd7)] p-6 font-body text-[#143321]">
      <section className="w-full max-w-4xl rounded-3xl border border-[#1b4f2f1f] bg-white/80 p-11 text-center shadow-[0_20px_60px_rgba(20,51,33,0.16)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500 max-md:rounded-2xl max-md:p-6">
        <p className="font-heading text-xs uppercase tracking-[0.08em] text-[#4d6b5a]">Sistema de gestion agricola</p>
        <h1 className="my-2 font-heading text-4xl leading-tight md:text-6xl">Invernadero Inteligente</h1>
        <p className="m-0 text-[#4d6b5a]">
          Monitorea sensores, controla actuadores y administra el equipo desde una sola plataforma.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-[#2f7f3c] to-[#1b4f2f] px-4 py-2.5 font-bold text-white shadow-[0_8px_24px_rgba(27,79,47,0.25)] transition hover:-translate-y-0.5"
          >
            Ir a login
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl bg-[#edf4ec] px-4 py-2.5 font-bold text-[#204b35] transition hover:-translate-y-0.5"
          >
            Crear cuenta
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
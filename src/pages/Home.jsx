import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Gauge, Leaf, ShieldCheck } from "lucide-react";

function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-primary-900">
      <div className="pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-5">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-[#e5e0c3] bg-white/90 p-8 lg:col-span-3"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary-700/70">SaaS IoT Platform</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">Invernadero Inteligente Control Center</h1>
          <p className="mt-4 max-w-2xl text-primary-700/60">
            Monitorea telemetría agrícola en tiempo real, ejecuta automatizaciones críticas y administra tu operación desde un dashboard unificado.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400"
            >
              Entrar al panel
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-xl border border-[#e5e0c3] bg-white px-4 py-2.5 text-sm font-semibold text-primary-900 transition hover:bg-[#f5f3e7]"
            >
              Crear cuenta
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-xl border border-[#e5e0c3] bg-white/90 p-4">
              <Gauge className="h-4 w-4 text-primary-400" />
              <p className="mt-2 text-xs uppercase tracking-wide text-primary-700/70">Monitoreo</p>
              <p className="mt-1 text-sm font-semibold text-primary-900">Telemetría en vivo</p>
            </div>
            {/* Card 2 */}
            <div className="rounded-xl border border-[#e5e0c3] bg-white/90 p-4">
              <Cpu className="h-4 w-4 text-primary-400" />
              <p className="mt-2 text-xs uppercase tracking-wide text-primary-700/70">Control</p>
              <p className="mt-1 text-sm font-semibold text-primary-900">Actuación remota</p>
            </div>
            {/* Card 3 */}
            <div className="rounded-xl border border-[#e5e0c3] bg-white/90 p-4">
              <Leaf className="h-4 w-4 text-primary-400" />
              <p className="mt-2 text-xs uppercase tracking-wide text-primary-700/70">Gestión</p>
              <p className="mt-1 text-sm font-semibold text-primary-900">Cultivos e insumos</p>
            </div>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="space-y-4 lg:col-span-2"
        >
          <section className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-5">
            <h2 className="text-lg font-semibold text-primary-900">Inicio rápido</h2>
            <ol className="mt-3 space-y-2 text-sm text-primary-700/60">
              <li>1. Inicia sesión con tu cuenta.</li>
              <li>2. Crea o activa zonas de cultivo.</li>
              <li>3. Configura umbrales por variable.</li>
              <li>4. Verifica lectura de sensores en dashboard.</li>
            </ol>
          </section>
          <section className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary-400" />
              <h2 className="text-lg font-semibold text-primary-900">Integración IoT</h2>
            </div>
            <p className="mt-2 text-sm text-primary-700/60">
              Los sensores se registran desde dispositivos conectados. Crea zona y umbrales, luego la lectura MQTT aparecerá automáticamente en el control center.
            </p>
          </section>
        </motion.aside>
      </div>
    </main>
  );
}

export default Home;

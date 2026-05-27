import { useMemo } from "react";
import { CalendarDays, CircleDot, Search, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function DashboardHeader({ systemStatus, sensorsActive, lastUpdate }) {
  const { auth } = useAuth();
  const now = useMemo(() => new Date(), []);
  return (
    <motion.header
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-[#f5f3e7]/80 to-white/90 dark:from-[#1b2e23]/80 dark:to-[#1b2e23]/60 shadow-lg border border-[#e5e0c3] mb-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700/60 dark:text-emerald-300/80">Panel principal</span>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-emerald-900 dark:text-emerald-100">
          {greeting()}, {auth.fullName || auth.email}
        </h1>
        <div className="flex items-center gap-3 mt-1 text-xs text-emerald-700/70 dark:text-emerald-200/80">
          <CalendarDays className="w-4 h-4" />
          <span>{now.toLocaleDateString("es", { dateStyle: "full" })}</span>
          <span className="mx-2">·</span>
          <span>{now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 bg-white/80 dark:bg-[#1b2e23]/80 rounded-xl px-4 py-2 shadow border border-[#e5e0c3] dark:border-[#2d3c2e]">
          <CircleDot className={systemStatus === "online" ? "text-emerald-500" : "text-red-400"} />
          <span className="font-semibold text-emerald-900 dark:text-emerald-100">{systemStatus === "online" ? "Sistema online" : "Sin conexión"}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 dark:bg-[#1b2e23]/80 rounded-xl px-4 py-2 shadow border border-[#e5e0c3] dark:border-[#2d3c2e]">
          <Gauge className="text-emerald-500" />
          <span className="font-semibold text-emerald-900 dark:text-emerald-100">{sensorsActive} sensores activos</span>
        </div>
        <div className="flex items-center gap-2 bg-white/80 dark:bg-[#1b2e23]/80 rounded-xl px-4 py-2 shadow border border-[#e5e0c3] dark:border-[#2d3c2e]">
          <CalendarDays className="text-emerald-500" />
          <span className="font-semibold text-emerald-900 dark:text-emerald-100">Última actualización: {lastUpdate}</span>
        </div>
      </div>
      {/* Barra de búsqueda eliminada por requerimiento UX */}
    </motion.header>
  );
}

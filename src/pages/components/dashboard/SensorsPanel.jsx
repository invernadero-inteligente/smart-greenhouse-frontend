import { useSensors } from "../../../hooks/useSensors";
import SensorCard from "./SensorCard";
import { motion } from "framer-motion";

export default function SensorsPanel() {
  const { sensors, generatedAt, loading: loadingSensors, metrics: sensorMetrics, fetchSensors } = useSensors();

  return (
    <motion.section
      className="rounded-3xl bg-gradient-to-br from-[#f5f3e7]/80 to-white/90 dark:from-[#1b2e23]/80 dark:to-[#1b2e23]/60 border border-[#e5e0c3] dark:border-[#2d3c2e] shadow-xl p-6 mt-4"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-emerald-900 dark:text-emerald-100">Sensores en tiempo real</h2>
          <p className="text-xs text-emerald-700/60 dark:text-emerald-200/80">
            {generatedAt
              ? `Última lectura: ${new Date(generatedAt).toLocaleString("es", { dateStyle: "short", timeStyle: "short" })}`
              : "Sin lecturas disponibles"}
          </p>
        </div>
        <button
          onClick={fetchSensors}
          className="rounded-lg border border-[#e5e0c3] dark:border-[#2d3c2e] px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-100 hover:bg-[#f5f3e7] dark:hover:bg-[#1b2e23]"
        >
          Actualizar
        </button>
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{sensorMetrics.online}</span>
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">Online</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-600">{sensorMetrics.critical}</span>
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">Críticos</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-400">{sensorMetrics.warning}</span>
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">Warning</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{sensorMetrics.total}</span>
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">Total</span>
        </div>
      </div>
      {loadingSensors ? (
        <div className="rounded-xl border border-[#e5e0c3] bg-white/90 dark:bg-[#1b2e23]/80 p-4 text-sm text-emerald-700/60 dark:text-emerald-200/80">Cargando sensores...</div>
      ) : sensors.length === 0 ? (
        <div className="rounded-xl border border-[#e5e0c3] bg-white/90 dark:bg-[#1b2e23]/80 p-4 text-sm text-emerald-700/60 dark:text-emerald-200/80">No hay sensores activos para mostrar.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 mt-4">
          {sensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      )}
    </motion.section>
  );
}

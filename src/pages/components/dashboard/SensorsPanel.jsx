import { useSensors } from "../../../hooks/useSensors";
import SensorCard from "./SensorCard";
import { motion } from "framer-motion";

export default function SensorsPanel() {
  const { sensors, generatedAt, loading: loadingSensors, metrics: sensorMetrics, fetchSensors } = useSensors();

  return (
    <motion.section
      className="rounded-3xl bg-gradient-to-br from-[#f5f3e7]/80 to-white/90 border border-[#e5e0c3] shadow-xl p-6 mt-4"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="font-heading text-lg font-bold text-emerald-900">Sensores en tiempo real</h2>
          <p className="text-xs text-emerald-700/60">
            {generatedAt
              ? `Última lectura: ${new Date(generatedAt).toLocaleString("es", { dateStyle: "short", timeStyle: "short" })}`
              : "Sin lecturas disponibles"}
          </p>
        </div>
        <button
          onClick={fetchSensors}
          className="rounded-lg border border-[#e5e0c3] px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-[#f5f3e7]"
        >
          Actualizar
        </button>
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-emerald-900">{sensorMetrics.online}</span>
          <span className="text-xs text-emerald-700/60">Online</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-600">{sensorMetrics.critical}</span>
          <span className="text-xs text-emerald-700/60">Críticos</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-amber-400">{sensorMetrics.warning}</span>
          <span className="text-xs text-emerald-700/60">Warning</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-emerald-900">{sensorMetrics.total}</span>
          <span className="text-xs text-emerald-700/60">Total</span>
        </div>
      </div>
      {loadingSensors ? (
        <div className="rounded-xl border border-[#e5e0c3] bg-white/90 p-4 text-sm text-emerald-700/60">Cargando sensores...</div>
      ) : sensors.length === 0 ? (
        <div className="rounded-xl border border-[#e5e0c3] bg-white/90 p-4 text-sm text-emerald-700/60">No hay sensores activos para mostrar.</div>
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

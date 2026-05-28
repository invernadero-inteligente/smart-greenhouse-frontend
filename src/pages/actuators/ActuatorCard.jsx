import { motion } from "framer-motion";
import { FiCpu, FiPower, FiZap, FiActivity } from "react-icons/fi";

export default function ActuatorCard({
  actuator,
  onToggle,
  loading = false,
}) {
  const currentState = actuator?.currentAction || actuator?.state || "OFF";
  const isOn = currentState === "ON";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      whileHover={{ y: -4 }}
      className={`
        relative w-full overflow-hidden rounded-3xl border p-4 sm:p-5 shadow-lg transition-all duration-300
        ${isOn ? "bg-gradient-to-br from-emerald-50 to-white border-emerald-300" : "bg-white border-zinc-200"}
      `}
    >
      {/* Glow de fondo */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none
          ${isOn ? "bg-emerald-400" : "bg-zinc-300"}
        `}
      />

      {/* CONTENIDO SUPERIOR */}
      <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* IZQUIERDA: Icono + Información */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          {/* ICONO */}
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300
              ${isOn ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-zinc-100 text-zinc-500"}
            `}
          >
            <FiCpu size={24} />
          </div>

          {/* TEXTOS */}
          <div className="flex flex-col flex-1">
            {/* Aquí está el nombre. Le quité el truncate para que no desaparezca */}
            <h3 className="text-base sm:text-lg font-bold text-zinc-800 leading-tight pr-2">
              {actuator?.name || "Actuador"}
            </h3>
            
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Actuador inteligente
            </p>

            {/* BADGES */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shrink-0
                  ${isOn ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}
                `}
              >
                <FiZap size={10} />
                {isOn ? "ON" : "OFF"}
              </span>
              <span className="text-xs text-zinc-400">
                ID #{actuator?.id}
              </span>
            </div>
          </div>
        </div>

        {/* DERECHA: SWITCH */}
        <button
          type="button"
          disabled={loading}
          onClick={() => onToggle(actuator)}
          className={`relative w-12 h-7 sm:w-14 sm:h-8 rounded-full shrink-0 transition-colors duration-300 focus:outline-none 
            ${isOn ? "bg-emerald-500" : "bg-zinc-300"} 
            ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm flex items-center justify-center
              ${isOn ? "left-6 sm:left-7" : "left-1"}
            `}
          >
            <FiPower
              size={12}
              className={isOn ? "text-emerald-600" : "text-zinc-400"}
            />
          </motion.div>
        </button>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full shrink-0
              ${isOn ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}
            `}
          />
          <span className="text-xs sm:text-sm text-zinc-600 font-medium">
            {isOn ? "Sistema activo" : "Sistema apagado"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-400 shrink-0">
          <FiActivity size={12} />
          {loading
            ? "Enviando..."
            : actuator?.updatedAt
            ? new Date(actuator.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : "Sin actividad"}
        </div>
      </div>
    </motion.div>
  );
}
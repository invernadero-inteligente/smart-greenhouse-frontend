import { Leaf, MapPinned, AlertTriangle, Package } from "lucide-react";
import { motion } from "framer-motion";

const statsMock = [
  {
    label: "Zonas activas",
    value: 4,
    icon: MapPinned,
    trend: "+1",
    color: "text-primary-500",
    bg: "bg-primary-100"
  },
  {
    label: "Cultivos activos",
    value: 12,
    icon: Leaf,
    trend: "-2",
    color: "text-lime-500",
    bg: "bg-lime-100"
  },
  {
    label: "Alertas",
    value: 2,
    icon: AlertTriangle,
    trend: "+2",
    color: "text-red-400",
    bg: "bg-red-100"
  },
  {
    label: "Stock bajo",
    value: 1,
    icon: Package,
    trend: "0",
    color: "text-amber-400",
    bg: "bg-amber-100"
  }
];

export default function StatsCards({ stats = statsMock }) {
  return (
    <motion.section className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className={
              `flex flex-col items-center justify-center rounded-2xl p-5 shadow border border-[#e5e0c3] bg-white/90 hover:scale-[1.03] transition-transform duration-200 group ${stat.bg}`
            }
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Icon className={`w-8 h-8 mb-2 ${stat.color}`} />
            <span className="text-3xl font-bold text-primary-900">{stat.value}</span>
            <span className="text-xs text-primary-700/60 uppercase tracking-widest">{stat.label}</span>
            <span className="text-xs mt-1 font-semibold text-primary-500">{stat.trend} hoy</span>
          </motion.div>
        );
      })}
    </motion.section>
  );
}


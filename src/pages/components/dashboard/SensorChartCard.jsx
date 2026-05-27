import { LineChart, Line, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  flat: ArrowRight
};

export default function SensorChartCard({ title, variable, data, current, avg, max, min, trend }) {
  const TrendIcon = trendIcon[trend] || ArrowRight;
  return (
    <motion.div
      className="relative rounded-3xl bg-gradient-to-br from-[#f5f3e7]/80 to-white/90 dark:from-[#1b2e23]/80 dark:to-[#1b2e23]/60 border border-[#e5e0c3] dark:border-[#2d3c2e] shadow-xl p-6 flex flex-col gap-4 hover:scale-[1.01] transition-transform duration-200 group"
      whileHover={{ scale: 1.015 }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-heading text-lg font-bold text-emerald-900 dark:text-emerald-100">{title}</h2>
          <span className="text-xs text-emerald-700/70 dark:text-emerald-200/80 uppercase tracking-widest">{variable}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{current}</span>
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">actual</span>
        </div>
      </div>
      <div className="flex gap-4 mb-2">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-emerald-900 dark:text-emerald-100">{avg}</span>
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">Prom</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-emerald-900 dark:text-emerald-100">{max}</span>
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">Max</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-emerald-900 dark:text-emerald-100">{min}</span>
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">Min</span>
        </div>
        <div className="flex flex-col items-center">
          <TrendIcon className={trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-400" : "text-amber-400"} />
          <span className="text-xs text-emerald-700/60 dark:text-emerald-200/80">Tendencia</span>
        </div>
      </div>
      <div className="relative h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.map((v, i) => ({ x: i + 1, y: v }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e0c3" />
            <XAxis dataKey="x" tick={{ fontSize: 12, fill: "#1b4f2f" }} hide />
            <YAxis tick={{ fontSize: 12, fill: "#1b4f2f" }} hide domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e0c3', color: '#1b4f2f' }} />
            <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={3} dot={false} isAnimationActive />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

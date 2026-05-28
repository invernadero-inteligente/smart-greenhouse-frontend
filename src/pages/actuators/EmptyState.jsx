import { motion } from "framer-motion";

export default function EmptyState({
  icon,
  title,
  description,
  cta,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex flex-col items-center justify-center py-16 px-6 text-center rounded-3xl border border-dashed border-zinc-200 bg-gradient-to-b from-white to-zinc-50"
    >
      <div className="w-20 h-20 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-5 shadow-inner">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-zinc-800 mb-2">
        {title}
      </h3>

      <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
        {description}
      </p>

      {cta && (
        <div className="mt-6">
          {cta}
        </div>
      )}
    </motion.div>
  );
}
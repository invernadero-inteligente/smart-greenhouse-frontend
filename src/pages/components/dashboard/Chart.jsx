import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";

// data: array de objetos { timestamp, variable1, variable2, ... }
export default function Chart({ data, lines = [], bars = [], areas = [], xKey = "timestamp", yLabel = "", height = 260, colors = [], empty }) {
  return (
    <div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-4 mb-6">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0c3" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#1b4f2f" }} />
          <YAxis tick={{ fontSize: 12, fill: "#1b4f2f" }} label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#1b4f2f', fontSize: 13 } : undefined} />
          <Tooltip />
          <Legend />
          {lines.map((key, i) => (
            <Line key={key} type="monotone" dataKey={key} stroke={colors[i] || "#10b981"} strokeWidth={2} dot={false} />
          ))}
          {bars.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i] || "#fbbf24"} />
          ))}
          {areas.map((key, i) => (
            <Area key={key} type="monotone" dataKey={key} stroke={colors[i] || "#eab308"} fillOpacity={0.2} fill={colors[i] || "#fde68a"} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {empty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-primary-700/60 text-sm font-semibold">Sin datos disponibles</span>
        </div>
      )}
    </div>
  );
}


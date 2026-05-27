
import { useMemo } from "react";
import { useSensors } from "../../hooks/useSensors";
import { useZones } from "../../hooks/useZones";
import { useCrops } from "../../hooks/useCrops";
import { useAlerts } from "../../hooks/useAlerts";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import AnalyticsCharts from "../components/dashboard/AnalyticsCharts";
import StatsCards from "../components/dashboard/StatsCards";
import SensorsPanel from "../components/dashboard/SensorsPanel";
import SensorCatalogManager from "../components/dashboard/SensorCatalogManager";

// --- NUEVO DASHBOARD PREMIUM ---

export default function Dashboard() {
  // Datos principales
  const { sensors, loading: loadingSensors, generatedAt } = useSensors();
  const { zones } = useZones();
  const { crops } = useCrops();
  const { alerts } = useAlerts();

  // Agrupar sensores por variable para gráficas
  const charts = useMemo(() => {
    if (!sensors || sensors.length === 0) return [];
    const grouped = sensors.reduce((acc, sensor) => {
      const key = sensor.variable;
      if (!acc[key]) acc[key] = [];
      acc[key].push(sensor);
      return acc;
    }, {});
    return Object.entries(grouped).map(([variable, readings]) => {
      const sorted = readings.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const data = sorted.map(r => Number(r.value));
      const current = data[data.length - 1];
      const avg = (data.reduce((sum, v) => sum + v, 0) / data.length).toFixed(1);
      const max = Math.max(...data);
      const min = Math.min(...data);
      let trend = "flat";
      if (data.length > 1) {
        if (data[data.length - 1] > data[0]) trend = "up";
        else if (data[data.length - 1] < data[0]) trend = "down";
      }
      const variableTitles = {
        TEMPERATURE: "Temperatura",
        HUMIDITY: "Humedad",
        CO2: "CO2",
        LUMINOSITY: "Luminosidad",
        SOIL_HUMIDITY: "Humedad Suelo",
        WATER_CONSUMPTION: "Consumo Agua",
      };
      const title = variableTitles[variable] || variable;
      return {
        title,
        variable,
        data,
        current,
        avg,
        max,
        min,
        trend,
        lastUpdate: readings[readings.length - 1]?.timestamp,
      };
    });
  }, [sensors]);

  // KPIs
  const kpiStats = [
    {
      label: "Zonas activas",
      value: zones.filter(z => z.isActive !== false).length,
      icon: "map",
      trend: "",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      label: "Cultivos",
      value: crops.length,
      icon: "leaf",
      trend: "",
      color: "text-lime-500",
      bg: "bg-lime-50"
    },
    {
      label: "Alertas",
      value: alerts.length,
      icon: "alert",
      trend: "",
      color: "text-red-400",
      bg: "bg-red-50"
    },
    {
      label: "Stock",
      value: "-",
      icon: "package",
      trend: "",
      color: "text-amber-400",
      bg: "bg-amber-50"
    }
  ];

  // --- LAYOUT ---
  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-12">
      {/* HEADER */}
      <DashboardHeader systemStatus="online" sensorsActive={sensors.length} lastUpdate={generatedAt ? new Date(generatedAt).toLocaleString("es", { dateStyle: "short", timeStyle: "short" }) : "-"} />

      {/* KPIs SECTION */}
      <section className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiStats.map((stat, i) => (
            <KpiCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* GRÁFICAS SECTION */}
      <section className="w-full">
        <AnalyticsCharts charts={charts} />
      </section>

      {/* SENSORES EN TIEMPO REAL */}
      <SensorsPanel />

      {/* CATÁLOGO MANUAL DE SENSORES */}
      <SensorCatalogManager />
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 18) return "Buenas tardes";
  return "Buenas noches";
}

function KpiCard({ label, value, icon, trend, color, bg }) {
  // Iconos Lucide
  const icons = {
    map: <svg className="w-8 h-8 mb-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.053-1.764l5.447-2.724a2 2 0 011.788 0l5.447 2.724A2 2 0 0121 5.618v9.764a2 2 0 01-1.053 1.764L14.5 20.5a2 2 0 01-1.788 0L9 20z" /></svg>,
    leaf: <svg className="w-8 h-8 mb-3 text-lime-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 21c0-4.418 7-10 7-10s7 5.582 7 10a7 7 0 01-14 0z" /></svg>,
    alert: <svg className="w-8 h-8 mb-3 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    package: <svg className="w-8 h-8 mb-3 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1.106-1.789l-7-4a2 2 0 00-1.788 0l-7 4A2 2 0 003 8v8a2 2 0 001.106 1.789l7 4a2 2 0 001.788 0l7-4A2 2 0 0021 16z" /></svg>,
  };
  return (
    <div className={`rounded-3xl shadow-xl border border-[#e5e0c3]/60 dark:border-[#2d3c2e]/60 ${bg} p-8 flex flex-col items-center hover:scale-[1.03] transition-transform duration-200 group min-h-[180px]`}> 
      {icons[icon]}
      <span className="text-4xl md:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">{value}</span>
      <span className="text-base font-semibold text-emerald-700/80 dark:text-emerald-200/80 mb-1">{label}</span>
      {trend && <span className="text-xs mt-1 font-semibold text-emerald-500 dark:text-emerald-300">{trend} hoy</span>}
    </div>
  );
}

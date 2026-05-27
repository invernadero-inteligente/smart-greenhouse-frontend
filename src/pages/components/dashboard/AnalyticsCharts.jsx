import { motion } from "framer-motion";
import SensorChartCard from "./SensorChartCard";



export default function AnalyticsCharts({ charts, expectedVariables }) {
  // Si no se pasa expectedVariables, usar las variables de los charts
  const variables = expectedVariables || (charts ? charts.map(c => c.variable) : []);
  // Si no hay charts, mostrar cards vacías para cada variable esperada
  const chartsToShow = (variables.length > 0)
    ? variables.map(variable => charts?.find(c => c.variable === variable) || { variable, empty: true })
    : charts || [];

  return (
    <motion.section
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ staggerChildren: 0.1 }}
    >
      {chartsToShow.map((chart, i) =>
        chart.empty ? (
          <div
            key={chart.variable || i}
            className="w-full min-w-[320px] max-w-[600px] mx-auto rounded-3xl border border-[#e5e0c3] bg-white/80 p-12 flex flex-col items-center justify-center min-h-[340px] shadow"
          >
            <span className="text-2xl font-bold text-emerald-700/60 mb-2">{getChartTitle(chart.variable)}</span>
            <span className="text-base text-emerald-700/40">Sin datos para mostrar</span>
          </div>
        ) : (
          <div className="w-full min-w-[320px] max-w-[600px] mx-auto">
            <SensorChartCard key={chart.variable} {...chart} />
          </div>
        )
      )}
    </motion.section>
  );
}

function getChartTitle(variable) {
  const variableTitles = {
    TEMPERATURE: "Temperatura",
    HUMIDITY: "Humedad",
    CO2: "CO2",
    LUMINOSITY: "Luminosidad",
    SOIL_HUMIDITY: "Humedad Suelo",
    WATER_CONSUMPTION: "Consumo Agua",
  };
  return variableTitles[variable] || variable || "Gráfica";
}

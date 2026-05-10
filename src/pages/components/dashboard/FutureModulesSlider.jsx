import { useMemo, useState } from "react";

const FUTURE_MODULES = [
	{
		title: "Zonas del Invernadero",
		description: "Gestion de zonas fisicas, area y distribucion para organizar sensores y cultivos.",
		status: "Base de datos lista",
		backendModule: "zones",
		tables: ["zones"]
	},
	{
		title: "Cultivos y Estados",
		description: "Seguimiento de cultivos, fechas de siembra/cosecha y estado de ciclo de vida.",
		status: "Modelo de dominio listo",
		backendModule: "crops",
		tables: ["crops", "crop_conditions"]
	},
	{
		title: "Sensores IoT",
		description: "Registro de sensores por zona y monitoreo de estado operativo.",
		status: "Base y modelos listos",
		backendModule: "sensors",
		tables: ["sensors"]
	},
	{
		title: "Umbrales y Cambios",
		description: "Configuracion de minimos/maximos por variable y auditoria de cambios.",
		status: "Persistencia lista",
		backendModule: "thresholds",
		tables: ["threshold_configs", "threshold_change_history"]
	},
	{
		title: "Alertas Inteligentes",
		description: "Alertas con severidad, origen y flujo de resolucion por usuario.",
		status: "Modelo de alertas listo",
		backendModule: "alerts",
		tables: ["alerts"]
	},
	{
		title: "Inventario Operativo",
		description: "Control de insumos por categoria, cantidad y unidad de medida.",
		status: "Entidad y tabla listas",
		backendModule: "inventory",
		tables: ["inventory_items"]
	},
	{
		title: "Resultados de IA",
		description: "Historial de analisis de IA por zona/cultivo para recomendaciones.",
		status: "Persistencia lista",
		backendModule: "ai",
		tables: ["ai_results"]
	}
];

function FutureModulesSlider() {
	const [current, setCurrent] = useState(0);

	const total = FUTURE_MODULES.length;

	const currentItem = useMemo(() => FUTURE_MODULES[current], [current]);

	const goPrev = () => {
		setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
	};

	const goNext = () => {
		setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
	};

	return (
		<section className="rounded-3xl border border-[#1b4f2f1f] bg-white/80 p-6 shadow-[0_20px_60px_rgba(20,51,33,0.16)] backdrop-blur-md max-md:rounded-2xl max-md:p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="font-heading text-xs uppercase tracking-[0.08em] text-[#4d6b5a]">
						Roadmap
					</p>
					<h2 className="my-1 font-heading text-2xl">Futuros Modulos</h2>
					<p className="m-0 text-sm text-[#4d6b5a]">
						Basado en modulos y tablas ya presentes en backend/base de datos.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={goPrev}
						className="rounded-xl bg-[#edf4ec] px-3 py-2 text-sm font-semibold text-[#204b35] transition hover:-translate-y-0.5"
					>
						Anterior
					</button>
					<button
						type="button"
						onClick={goNext}
						className="rounded-xl bg-gradient-to-br from-[#2f7f3c] to-[#1b4f2f] px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
					>
						Siguiente
					</button>
				</div>
			</div>

			<article className="mt-5 rounded-2xl border border-[#1433211f] bg-[#f8fcf7] p-5">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<h3 className="m-0 font-heading text-xl">{currentItem.title}</h3>
					<span className="rounded-full bg-[#daf3db] px-3 py-1 text-xs font-semibold text-[#145328]">
						{currentItem.status}
					</span>
				</div>

				<p className="mt-3 text-sm text-[#385844]">{currentItem.description}</p>

				<div className="mt-4 flex flex-wrap gap-2">
					<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#204b35]">
						Modulo: {currentItem.backendModule}
					</span>
					{currentItem.tables.map((table) => (
						<span
							key={table}
							className="rounded-full border border-[#1433211f] bg-white px-3 py-1 text-xs text-[#385844]"
						>
							Tabla: {table}
						</span>
					))}
				</div>
			</article>

			<div className="mt-4 flex items-center justify-between text-xs text-[#4d6b5a]">
				<span>
					Elemento {current + 1} de {total}
				</span>
				<div className="flex gap-1.5">
					{FUTURE_MODULES.map((item, index) => (
						<button
							type="button"
							key={item.title}
							onClick={() => setCurrent(index)}
							className={`h-2.5 w-2.5 rounded-full transition ${
								index === current ? "bg-[#1b4f2f]" : "bg-[#c9ddc5]"
							}`}
							aria-label={`Ir al modulo ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

export default FutureModulesSlider;
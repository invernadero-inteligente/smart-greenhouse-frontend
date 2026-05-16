import { useState } from "react";

function ActuatorsList() {
	const [actuators, setActuators] = useState([
		{
			id: 1,
			name: "Bomba de Riego Zona 1",
			zone: "Zona 1",
			currentAction: "ON",
			lastUpdate: new Date(Date.now() - 5 * 60000)
		},
		{
			id: 2,
			name: "Ventilador Zona 1",
			zone: "Zona 1",
			currentAction: "OFF",
			lastUpdate: new Date(Date.now() - 15 * 60000)
		}
	]);

	const toggleActuator = (id) => {
		setActuators(actuators.map(a =>
			a.id === id ? { ...a, currentAction: a.currentAction === "ON" ? "OFF" : "ON" } : a
		));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
					Control de Actuadores
				</h1>
				<span className="inline-block rounded-full bg-[#e9f5e6] px-3 py-1 text-sm font-bold text-[#2f7f3c]">
					{actuators.filter(a => a.currentAction === "ON").length}/{actuators.length}
				</span>
			</div>

			{actuators.length === 0 ? (
				<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-8 text-center">
					<p className="text-[#666]">No hay actuadores configurados</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{actuators.map(actuator => (
						<div
							key={actuator.id}
							className="rounded-2xl border border-[#e9f5e6] bg-white p-6 shadow-soft transition hover:shadow-lg"
						>
							<div className="space-y-4">
								<div>
									<h3 className="font-heading text-lg font-bold text-[#1b4f2f]">
										{actuator.name}
									</h3>
									<p className="mt-1 text-xs text-[#999]">{actuator.zone}</p>
								</div>

								<div className="flex items-center justify-between rounded-lg bg-[#f9fcf8] p-4">
									<span className="text-sm font-semibold text-[#666]">Estado:</span>
									<span
										className={`inline-block rounded px-3 py-1 font-bold text-sm ${
											actuator.currentAction === "ON"
												? "bg-[#e9f5e6] text-[#2f7f3c]"
												: "bg-[#f5f5f5] text-[#999]"
										}`}
									>
										{actuator.currentAction === "ON" ? "🟢 Encendido" : "⚫ Apagado"}
									</span>
								</div>

								<div className="text-xs text-[#999]">
									Última actualización: {actuator.lastUpdate.toLocaleTimeString()}
								</div>

								<button
									onClick={() => toggleActuator(actuator.id)}
									className={`w-full rounded-lg px-4 py-2 font-semibold text-white transition ${
										actuator.currentAction === "ON"
											? "bg-[#b43a2f] hover:bg-[#8a2817]"
											: "bg-[#2f7f3c] hover:bg-[#1b4f2f]"
									}`}
								>
									{actuator.currentAction === "ON" ? "Apagar" : "Encender"}
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default ActuatorsList;

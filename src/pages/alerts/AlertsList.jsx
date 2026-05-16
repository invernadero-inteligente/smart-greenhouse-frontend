import { useState, useEffect } from "react";

function AlertsList() {
	const [alerts, setAlerts] = useState([
		{
			id: 1,
			variableName: "TEMPERATURE",
			severity: "WARNING",
			message: "Temperatura fuera de rango",
			zone: "Zona 1",
			value: 35,
			unit: "C",
			createdAt: new Date()
		}
	]);

	const severityConfig = {
		CRITICAL: { bg: "#fbe8e5", text: "#b43a2f", label: "Crítica" },
		WARNING: { bg: "#fff4e6", text: "#9f6b3d", label: "Advertencia" },
		INFO: { bg: "#f0f4ff", text: "#3d5f9f", label: "Información" }
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-heading text-3xl font-bold text-[#1b4f2f]">
					Alertas del Sistema
				</h1>
				<span className="inline-block rounded-full bg-[#fbe8e5] px-3 py-1 text-sm font-bold text-[#b43a2f]">
					{alerts.length} activas
				</span>
			</div>

			<div className="space-y-3">
				{alerts.length === 0 ? (
					<div className="rounded-2xl border border-[#e9f5e6] bg-[#f9fcf8] p-8 text-center">
						<p className="text-[#666]">No hay alertas activas</p>
					</div>
				) : (
					alerts.map(alert => {
						const config = severityConfig[alert.severity];
						return (
							<div
								key={alert.id}
								className="rounded-2xl border-l-4 border-l-[#b43a2f] bg-white p-6 shadow-soft transition hover:shadow-lg"
								style={{ borderLeftColor: config.text }}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-2">
											<span
												className="inline-block rounded px-2 py-1 text-xs font-bold"
												style={{
													backgroundColor: config.bg,
													color: config.text
												}}
											>
												{config.label}
											</span>
											<span className="text-sm font-semibold text-[#666]">
												{alert.zone}
											</span>
										</div>
										<h3 className="font-heading text-lg font-bold text-[#1b4f2f]">
											{alert.variableName.replace(/_/g, " ")}
										</h3>
										<p className="mt-2 text-sm text-[#666]">{alert.message}</p>
										<div className="mt-3 flex items-center gap-4 text-sm">
											<span className="font-semibold text-[#1b4f2f]">
												Valor: {alert.value} {alert.unit}
											</span>
											<span className="text-xs text-[#999]">
												{new Date(alert.createdAt).toLocaleString()}
											</span>
										</div>
									</div>
									<button className="rounded-lg bg-[#e9f5e6] px-4 py-2 font-semibold text-[#2f7f3c] transition hover:bg-[#d0e5c9]">
										Resolver
									</button>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

export default AlertsList;

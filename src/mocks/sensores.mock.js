export const sensorMocks = [
	{
		id: "sensor-01",
		name: "Temperatura interior",
		zone: "Zona Norte",
		crop: "Tomate",
		value: 28.4,
		unit: "°C",
		min: 18,
		max: 26,
		status: "ALERTA",
		message: "Temperatura por encima del umbral superior",
		lastUpdated: "2026-05-25T14:22:00.000Z"
	},
	{
		id: "sensor-02",
		name: "Humedad del suelo",
		zone: "Zona Sur",
		crop: "Lechuga",
		value: 58,
		unit: "%",
		min: 45,
		max: 75,
		status: "OK",
		message: "Humedad estable dentro del rango",
		lastUpdated: "2026-05-25T14:22:10.000Z"
	},
	{
		id: "sensor-03",
		name: "CO₂ ambiental",
		zone: "Zona Este",
		crop: "Fresa",
		value: 970,
		unit: "ppm",
		min: 400,
		max: 900,
		status: "ALERTA",
		message: "CO₂ por encima del límite recomendado",
		lastUpdated: "2026-05-25T14:22:20.000Z"
	},
	{
		id: "sensor-04",
		name: "Luminosidad",
		zone: "Zona Oeste",
		crop: "Cilantro",
		value: 320,
		unit: "lux",
		min: 300,
		max: 1200,
		status: "OK",
		message: "Nivel de luz apropiado para el cultivo",
		lastUpdated: "2026-05-25T14:22:30.000Z"
	}
];

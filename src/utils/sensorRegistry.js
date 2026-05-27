const SENSOR_REGISTRY_KEY = "smart-greenhouse.sensor-registry.v1";

function parseStoredSensors(rawValue) {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSensors(sensors) {
  localStorage.setItem(SENSOR_REGISTRY_KEY, JSON.stringify(sensors));
}

function normalizeVariable(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function normalizeZoneName(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function getRegisteredSensorKey(zoneId, variable, zoneName = null) {
  const hasZoneId = zoneId !== null && zoneId !== undefined && String(zoneId).trim() !== "";
  const zoneToken = hasZoneId
    ? `id:${zoneId}`
    : normalizeZoneName(zoneName)
      ? `name:${normalizeZoneName(zoneName)}`
      : "no-zone";

  return `${zoneToken}::${normalizeVariable(variable)}`;
}

export function listRegisteredSensors() {
  return parseStoredSensors(localStorage.getItem(SENSOR_REGISTRY_KEY));
}

export function registerSensor(payload) {
  const hasZoneId = payload?.zoneId !== null && payload?.zoneId !== undefined && String(payload?.zoneId).trim() !== "";
  const zoneId = hasZoneId ? Number(payload.zoneId) : null;
  const zoneName = String(payload?.zoneName ?? "").trim();
  const variable = normalizeVariable(payload?.variable);
  const alias = String(payload?.alias ?? "").trim();

  if ((zoneId !== null && Number.isNaN(zoneId)) || (!zoneId && !zoneName)) {
    throw new Error("Selecciona una zona valida");
  }

  if (!variable) {
    throw new Error("Ingresa una variable valida");
  }

  if (!alias) {
    throw new Error("Ingresa un alias para el sensor");
  }

  const sensors = listRegisteredSensors();
  const sensorKey = getRegisteredSensorKey(zoneId, variable, zoneName);
  const existingIndex = sensors.findIndex(
    (item) => getRegisteredSensorKey(item.zoneId, item.variable, item.zoneName) === sensorKey
  );

  const nextSensor = {
    id: existingIndex >= 0 ? sensors[existingIndex].id : Date.now(),
    zoneId,
    zoneName: zoneName || sensors[existingIndex]?.zoneName || "Zona",
    variable,
    alias,
    unit: String(payload?.unit ?? "").trim(),
    isActive: true,
    createdAt: existingIndex >= 0 ? sensors[existingIndex].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    sensors[existingIndex] = nextSensor;
  } else {
    sensors.push(nextSensor);
  }

  persistSensors(sensors);
  return nextSensor;
}

export function setRegisteredSensorActive(sensorId, isActive) {
  const sensors = listRegisteredSensors();
  const updated = sensors.map((sensor) =>
    sensor.id === sensorId
      ? { ...sensor, isActive: Boolean(isActive), updatedAt: new Date().toISOString() }
      : sensor
  );

  persistSensors(updated);
  return updated;
}

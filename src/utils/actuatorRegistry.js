const ACTUATOR_CATALOG_KEY = "invernadero_zone_actuator_catalog";

function normalizeMap(input) {
  if (!input || typeof input !== "object") return {};

  const entries = Object.entries(input).map(([zoneId, names]) => {
    const list = Array.isArray(names)
      ? Array.from(new Set(names.map((n) => String(n ?? "").trim()).filter(Boolean)))
      : [];
    return [String(zoneId), list];
  });

  return Object.fromEntries(entries);
}

export function loadZoneActuatorCatalog() {
  try {
    const raw = localStorage.getItem(ACTUATOR_CATALOG_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return normalizeMap(parsed);
  } catch {
    return {};
  }
}

export function saveZoneActuatorCatalog(catalog) {
  const normalized = normalizeMap(catalog);
  localStorage.setItem(ACTUATOR_CATALOG_KEY, JSON.stringify(normalized));
  return normalized;
}

export function addActuatorToZoneCatalog(catalog, zoneId, actuatorName) {
  const normalizedZoneId = String(zoneId ?? "");
  const cleanName = String(actuatorName ?? "").trim();

  if (!normalizedZoneId || !cleanName) {
    return normalizeMap(catalog);
  }

  const normalized = normalizeMap(catalog);
  const current = normalized[normalizedZoneId] ?? [];

  return {
    ...normalized,
    [normalizedZoneId]: Array.from(new Set([...current, cleanName])),
  };
}

export function removeActuatorFromZoneCatalog(catalog, zoneId, actuatorName) {
  const normalizedZoneId = String(zoneId ?? "");
  const cleanName = String(actuatorName ?? "").trim();

  if (!normalizedZoneId || !cleanName) {
    return normalizeMap(catalog);
  }

  const normalized = normalizeMap(catalog);
  const current = normalized[normalizedZoneId] ?? [];

  return {
    ...normalized,
    [normalizedZoneId]: current.filter((name) => name !== cleanName),
  };
}

export function listZoneActuators(catalog, zoneId) {
  const normalized = normalizeMap(catalog);
  return normalized[String(zoneId ?? "")] ?? [];
}

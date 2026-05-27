const OPERATOR_TEMPLATES_KEY = "invernadero_operator_templates";

const DEFAULT_TEMPLATES = [
  {
    id: "riego-manana",
    name: "Riego de mañana",
    description: "Enciende riego y nebulización para arranque de jornada.",
    steps: [
      { actuatorName: "BombaRiego", action: "ON" },
      { actuatorName: "Nebulizador", action: "ON" },
    ],
  },
  {
    id: "ventilacion-emergencia",
    name: "Ventilación de emergencia",
    description: "Activa extracción y ventilación, apaga nebulización.",
    steps: [
      { actuatorName: "Extractor", action: "ON" },
      { actuatorName: "Ventilador", action: "ON" },
      { actuatorName: "Nebulizador", action: "OFF" },
    ],
  },
  {
    id: "cierre-nocturno",
    name: "Cierre nocturno",
    description: "Apaga actuadores principales para cierre de turno.",
    steps: [
      { actuatorName: "BombaRiego", action: "OFF" },
      { actuatorName: "Nebulizador", action: "OFF" },
      { actuatorName: "Ventilador", action: "OFF" },
    ],
  },
];

function normalizeTemplate(template) {
  const name = String(template?.name ?? "").trim();
  const description = String(template?.description ?? "").trim();
  const steps = Array.isArray(template?.steps)
    ? template.steps
        .map((step) => ({
          actuatorName: String(step?.actuatorName ?? "").trim(),
          action: String(step?.action ?? "ON").toUpperCase() === "OFF" ? "OFF" : "ON",
        }))
        .filter((step) => step.actuatorName)
    : [];

  return {
    id: String(template?.id ?? `tpl-${Date.now()}-${Math.random()}`),
    name: name || "Plantilla sin nombre",
    description,
    steps,
  };
}

function normalizeTemplateList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeTemplate).filter((tpl) => tpl.steps.length > 0);
}

function normalizeStore(value) {
  if (!value || typeof value !== "object") return {};
  const entries = Object.entries(value).map(([zoneId, templates]) => [
    String(zoneId),
    normalizeTemplateList(templates),
  ]);
  return Object.fromEntries(entries);
}

export function loadOperatorTemplatesStore() {
  try {
    const raw = localStorage.getItem(OPERATOR_TEMPLATES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return normalizeStore(parsed);
  } catch {
    return {};
  }
}

export function saveOperatorTemplatesStore(store) {
  const normalized = normalizeStore(store);
  localStorage.setItem(OPERATOR_TEMPLATES_KEY, JSON.stringify(normalized));
  return normalized;
}

export function listTemplatesForZone(store, zoneId) {
  const normalized = normalizeStore(store);
  const zoneTemplates = normalized[String(zoneId ?? "")] ?? [];
  return [...DEFAULT_TEMPLATES, ...zoneTemplates];
}

export function createTemplateForZone(store, zoneId, templateInput) {
  const normalized = normalizeStore(store);
  const zoneKey = String(zoneId ?? "");
  const template = normalizeTemplate({
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...templateInput,
  });

  if (!zoneKey || template.steps.length === 0) {
    return normalized;
  }

  const current = normalized[zoneKey] ?? [];
  return {
    ...normalized,
    [zoneKey]: [...current, template],
  };
}

export function removeTemplateForZone(store, zoneId, templateId) {
  const normalized = normalizeStore(store);
  const zoneKey = String(zoneId ?? "");
  if (!zoneKey) return normalized;

  const current = normalized[zoneKey] ?? [];
  return {
    ...normalized,
    [zoneKey]: current.filter((tpl) => tpl.id !== templateId),
  };
}

export function isCustomTemplate(templateId) {
  return String(templateId ?? "").startsWith("custom-");
}

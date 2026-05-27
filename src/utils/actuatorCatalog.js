const DEFAULT_ACTUATORS = ["Ventilador", "BombaRiego", "Nebulizador", "Extractor"];

const ZONE_RULES = [
  { match: ["tomate", "pimiento"], actuators: ["Ventilador", "BombaRiego", "Extractor"] },
  { match: ["lechuga", "hidro"], actuators: ["BombaRiego", "Nebulizador", "ValvulaNutriente"] },
  { match: ["pepino"], actuators: ["BombaRiego", "Extractor", "Ventilador"] },
];

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getActuatorSuggestionsForZone(zoneName, history = []) {
  const normalizedZone = normalizeText(zoneName);
  const fromRules = ZONE_RULES
    .filter((rule) => rule.match.some((token) => normalizedZone.includes(normalizeText(token))))
    .flatMap((rule) => rule.actuators);

  const fromHistory = history
    .filter((entry) => entry?.ok && entry?.actuatorName)
    .map((entry) => String(entry.actuatorName).trim())
    .filter(Boolean);

  return Array.from(new Set([...fromRules, ...fromHistory, ...DEFAULT_ACTUATORS]));
}

export function isActuatorSuggested(name, suggestions) {
  const normalized = normalizeText(name);
  return suggestions.some((item) => normalizeText(item) === normalized);
}

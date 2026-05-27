import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useZones } from "../../hooks/useZones";
import { canOperate } from "../../utils/permissions";
import { actuatorService } from "../../services/actuator.service";
import { getApiErrorMessage } from "../../services/api";
import { getActuatorSuggestionsForZone, isActuatorSuggested } from "../../utils/actuatorCatalog";
import {
	createTemplateForZone,
	isCustomTemplate,
	listTemplatesForZone,
	loadOperatorTemplatesStore,
	removeTemplateForZone,
	saveOperatorTemplatesStore,
} from "../../utils/operatorTemplates";


const QUICK_ACTUATORS = ["Ventilador", "BombaRiego", "Nebulizador", "Extractor"];
const ACTUATOR_HISTORY_KEY = "invernadero_actuator_history";

function normalizeText(value) {
	return String(value ?? "")
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

function loadHistory() {
	try {
		const raw = localStorage.getItem(ACTUATOR_HISTORY_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export default function ActuatorsList() {
	const { auth } = useAuth();
	const { zones, loading: loadingZones } = useZones(true);
	const allowOperate = canOperate(auth.role);

	const [selectedZoneId, setSelectedZoneId] = useState("");
	const [actuatorName, setActuatorName] = useState(QUICK_ACTUATORS[0]);
	const [action, setAction] = useState("ON");
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(null);
	const [history, setHistory] = useState(loadHistory);
	const [templatesStore, setTemplatesStore] = useState(() => loadOperatorTemplatesStore());
	const [allowCustomActuator, setAllowCustomActuator] = useState(false);
	const [runningTemplateId, setRunningTemplateId] = useState(null);
	const [templateFeedback, setTemplateFeedback] = useState("");
	const [newTemplateName, setNewTemplateName] = useState("");
	const [newTemplateDescription, setNewTemplateDescription] = useState("");
	const [newTemplateSteps, setNewTemplateSteps] = useState([
		{ actuatorName: "BombaRiego", action: "ON" },
	]);
	const [mobileSection, setMobileSection] = useState("catalog");
	const [quickSearch, setQuickSearch] = useState("");
	const [historyFilter, setHistoryFilter] = useState("ALL");
	const [historySort, setHistorySort] = useState("DATE_DESC");
	const [retryingHistoryId, setRetryingHistoryId] = useState(null);
	const [retryingAll, setRetryingAll] = useState(false);

	const zonesList = useMemo(() => (Array.isArray(zones) ? zones : []), [zones]);
	const targetZoneId = selectedZoneId || (zonesList[0]?.id ? String(zonesList[0].id) : "");
	const selectedZone = zonesList.find((zone) => String(zone.id) === String(targetZoneId));
	const suggestedActuators = useMemo(
		() => getActuatorSuggestionsForZone(selectedZone?.name, history),
		[selectedZone?.name, history]
	);
	const isSuggestedName = isActuatorSuggested(actuatorName, suggestedActuators);
	const filteredSuggestedActuators = useMemo(() => {
		const search = normalizeText(quickSearch);
		if (!search) return suggestedActuators;
		return suggestedActuators.filter((name) => normalizeText(name).includes(search));
	}, [suggestedActuators, quickSearch]);
	const zoneTemplates = useMemo(
		() => listTemplatesForZone(templatesStore, targetZoneId),
		[templatesStore, targetZoneId]
	);
	const [showTemplateEditor, setShowTemplateEditor] = useState(false);

	const successCount = history.filter((item) => item.ok).length;
	// Eliminado: zoneActuatorCount
	const zoneTemplateCount = zoneTemplates.length;
	const filteredHistory = useMemo(() => {
		if (historyFilter === "SENT") {
			return history.filter((item) => item.ok);
		}
		if (historyFilter === "ERROR") {
			return history.filter((item) => !item.ok);
		}
		return history;
	}, [history, historyFilter]);
	const displayedHistory = useMemo(() => {
		const list = [...filteredHistory];
		if (historySort === "DATE_ASC") {
			return list.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
		}
		if (historySort === "ACTUATOR_ASC") {
			return list.sort((a, b) => String(a.actuatorName ?? "").localeCompare(String(b.actuatorName ?? ""), "es"));
		}
		if (historySort === "STATUS") {
			return list.sort((a, b) => Number(b.ok) - Number(a.ok));
		}
		return list.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
	}, [filteredHistory, historySort]);
const failedVisibleCount = useMemo(() => displayedHistory.filter((item) => !item.ok).length, [displayedHistory]);

	useEffect(() => {
		localStorage.setItem(ACTUATOR_HISTORY_KEY, JSON.stringify(history));
	}, [history]);

	// Eliminado: useEffect para zoneCatalog

	useEffect(() => {
		saveOperatorTemplatesStore(templatesStore);
	}, [templatesStore]);

	useEffect(() => {
		setAllowCustomActuator(false);
	}, [targetZoneId]);

	// Eliminado: addCatalogActuator y setZoneCatalog

	// Eliminado: removeCatalogActuator y setZoneCatalog

	const addTemplateStep = () => {
		setNewTemplateSteps((prev) => [...prev, { actuatorName: "", action: "ON" }]);
	};

	const updateTemplateStep = (idx, field, value) => {
		setNewTemplateSteps((prev) => prev.map((step, index) => {
			if (index !== idx) return step;
			return {
				...step,
				[field]: field === "action" ? String(value).toUpperCase() : value,
			};
		}));
	};

	const removeTemplateStep = (idx) => {
		setNewTemplateSteps((prev) => prev.filter((_, index) => index !== idx));
	};

	const createTemplate = () => {
		if (!targetZoneId || !newTemplateName.trim()) {
			setError("Debes seleccionar zona y nombre de plantilla.");
			return;
		}

		const cleanSteps = newTemplateSteps
			.map((step) => ({ actuatorName: String(step.actuatorName ?? "").trim(), action: step.action === "OFF" ? "OFF" : "ON" }))
			.filter((step) => step.actuatorName);

		if (cleanSteps.length === 0) {
			setError("La plantilla debe tener al menos un paso con actuador.");
			return;
		}

		setTemplatesStore((prev) => createTemplateForZone(prev, targetZoneId, {
			name: newTemplateName,
			description: newTemplateDescription,
			steps: cleanSteps,
		}));

		setTemplateFeedback("Plantilla guardada correctamente.");
		setNewTemplateName("");
		setNewTemplateDescription("");
		setNewTemplateSteps([{ actuatorName: "", action: "ON" }]);
		setError(null);
	};

	const deleteTemplate = (templateId) => {
		if (!targetZoneId) return;
		setTemplatesStore((prev) => removeTemplateForZone(prev, targetZoneId, templateId));
	};

	const sendCommand = async (customAction, customActuatorName, forceCustom = false) => {
		if (!allowOperate) {
			return false;
		}

		const finalAction = customAction ?? action;
		const finalActuatorName = customActuatorName ?? actuatorName;



		if (!isActuatorSuggested(finalActuatorName, suggestedActuators) && !allowCustomActuator && !forceCustom) {
			setError("El actuador no está en el catálogo de esta zona. Agrega el nombre al catálogo o activa 'Forzar envío'.");
			return false;
		}

		try {
			setSending(true);
			setError(null);

			const sent = await actuatorService.sendActuatorEvent(targetZoneId, finalActuatorName, finalAction);
			const zoneName = zonesList.find((z) => String(z.id) === String(sent.zoneId))?.name ?? `Zona ${sent.zoneId}`;

			setHistory((prev) => [
				{
					id: `${Date.now()}-${Math.random()}`,
					...sent,
					zoneName,
					ok: true,
				},
				...prev,
			].slice(0, 12));
			return true;
		} catch (err) {
			const message = getApiErrorMessage(err);
			setError(message);
			const zoneName = zonesList.find((z) => String(z.id) === String(targetZoneId))?.name ?? `Zona ${targetZoneId}`;

			setHistory((prev) => [
				{
					id: `${Date.now()}-${Math.random()}`,
					zoneId: targetZoneId,
					zoneName,
					actuatorName: finalActuatorName,
					action: finalAction,
					sentAt: new Date().toISOString(),
					ok: false,
					message,
				},
				...prev,
			].slice(0, 12));
			return false;
		} finally {
			setSending(false);
		}
	};

	const runTemplate = async (template) => {
		if (!allowOperate || !targetZoneId || !template?.steps?.length) {
			return;
		}

		setTemplateFeedback("");
		setRunningTemplateId(template.id);

		let success = 0;
		for (const step of template.steps) {
			const ok = await sendCommand(step.action, step.actuatorName);
			if (ok) {
				success += 1;
			}
		}

		setRunningTemplateId(null);
		setTemplateFeedback(`Plantilla ejecutada: ${success}/${template.steps.length} comandos exitosos.`);
	};

	const retryHistoryItem = async (item) => {
		if (!item || item.ok) return;
		setRetryingHistoryId(item.id);
		await sendCommand(item.action, item.actuatorName, true);
		setRetryingHistoryId(null);
	};

	const retryAllFailed = async () => {
		const failed = displayedHistory.filter((item) => !item.ok);
		if (failed.length === 0) return;

		setRetryingAll(true);
		for (const item of failed) {
			await sendCommand(item.action, item.actuatorName, true);
		}
		setRetryingAll(false);
	};

	const exportHistoryCsv = () => {
		const rows = displayedHistory.map((item) => ([
			item.sentAt,
			item.zoneName ?? "",
			item.actuatorName ?? "",
			item.action ?? "",
			item.ok ? "Enviado" : "Error",
			item.message ?? "",
		]));

		const header = ["sentAt", "zone", "actuator", "action", "status", "detail"];
		const csv = [header, ...rows]
			.map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
			.join("\n");

		const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `actuadores-historial-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

		return (
			<div className="space-y-7">
				<div className="overflow-hidden rounded-3xl border border-[#e5e0c3] bg-white/90 p-7 text-emerald-900 shadow-md">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div>
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Centro de control IoT</p>
							<h1 className="mt-1 font-heading text-2xl font-bold text-emerald-700 md:text-3xl">Control de actuadores</h1>
							<p className="mt-1 text-sm text-emerald-700/80">
								Comando MQTT por zona en <span className="font-semibold text-emerald-600">/api/iot/actuator/event/{targetZoneId}</span>
							</p>
							{!allowOperate && (
								<p className="mt-2 inline-flex items-center rounded-full border border-emerald-200 bg-[#EFE7D7] px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Solo lectura - no puedes enviar comandos</p>
							)}
						</div>

						<div className="rounded-2xl border border-[#e5e0c3] bg-[#FAF7F2] px-5 py-4 text-right shadow-sm">
							<p className="text-[10px] uppercase tracking-wide text-emerald-600">Comandos exitosos</p>
							<p className="font-heading text-2xl font-bold text-emerald-700">{successCount}</p>
						</div>
					</div>

					<div className="mt-5 grid gap-4 md:grid-cols-3">
						<div className="rounded-2xl border border-[#e5e0c3] bg-[#FAF7F2] p-4 shadow-sm">
							<p className="text-[10px] uppercase tracking-wide text-emerald-600">Zona seleccionada</p>
							<p className="mt-1 text-base font-semibold text-emerald-700">{selectedZone?.name ?? "Sin zona"}</p>
						</div>

						<div className="rounded-2xl border border-[#e5e0c3] bg-[#FAF7F2] p-4 shadow-sm">
							<p className="text-[10px] uppercase tracking-wide text-emerald-600">Plantillas disponibles</p>
							<p className="mt-1 text-base font-semibold text-emerald-700">{zoneTemplateCount}</p>
						</div>
					</div>
				</div>

			<div className="grid gap-4 xl:grid-cols-12">
				<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-6 xl:col-span-8">
				<h2 className="font-heading text-lg font-bold text-emerald-900">Enviar comando</h2>
				<p className="mt-1 text-xs text-emerald-700/70">Selecciona zona, actuador y acción para ejecutar control remoto.</p>

					<div className="mt-4 grid gap-3 md:grid-cols-3">
						<label className="space-y-1">
						<span className="text-xs font-semibold uppercase tracking-wide text-emerald-700/70">Zona</span>
							<select
								value={targetZoneId}
								onChange={(e) => setSelectedZoneId(e.target.value)}
								className="card-input"
								disabled={loadingZones || !allowOperate || zonesList.length === 0}
							>
								{zonesList.length === 0 && <option value="">Sin zonas activas</option>}
								{zonesList.map((zone) => (
									<option key={zone.id} value={zone.id}>{zone.name}</option>
								))}
							</select>
						</label>

						<label className="space-y-1">
						<span className="text-xs font-semibold uppercase tracking-wide text-emerald-700/70">Actuador</span>
							<input
								value={actuatorName}
								onChange={(e) => setActuatorName(e.target.value)}
								list="quick-actuator-names"
								className={"card-input " + (isSuggestedName ? "" : "border-rose-200 text-rose-700")}
								placeholder="Ej. Ventilador"
								disabled={!allowOperate}
							/>
							<datalist id="quick-actuator-names">
								{suggestedActuators.map((name) => (
									<option key={name} value={name} />
								))}
							</datalist>
							{!isSuggestedName && actuatorName.trim() && (
								<p className="text-[11px] font-semibold text-rose-700">
									Nombre fuera del catálogo sugerido para esta zona.
								</p>
							)}
						</label>

						<label className="space-y-1">
						<span className="text-xs font-semibold uppercase tracking-wide text-emerald-700/70">Acción</span>
							<select
								value={action}
								onChange={(e) => setAction(e.target.value)}
								className="card-input"
								disabled={!allowOperate}
							>
								<option value="ON">ON</option>
								<option value="OFF">OFF</option>
							</select>
						</label>
					</div>

					<div className="mt-5 grid gap-2 sm:grid-cols-2">
						<button
							onClick={() => sendCommand("ON")}
							disabled={sending || !allowOperate || !targetZoneId || !actuatorName.trim()}
							className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Encender

						</button>
					</div>

					<label className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#e5e0c3] bg-[#f5f3e7] px-3 py-1.5 text-xs font-semibold text-emerald-900">
						<input
							type="checkbox"
							checked={allowCustomActuator}
							onChange={(e) => setAllowCustomActuator(e.target.checked)}
							disabled={!allowOperate}
						/>
						Forzar envío con nombre personalizado
					</label>


					{error && (
						<div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
							{error}
						</div>
					)}
				</div>

				<div className="rounded-2xl border border-[#e5e0c3] bg-white/90 p-6 xl:col-span-4 xl:sticky xl:top-24 self-start">
				<h2 className="font-heading text-lg font-bold text-emerald-900">Centro operativo</h2>
				<p className="mt-1 text-xs text-emerald-700/70">Acciones rápidas, catálogo por zona y automatizaciones.</p>
				<p className="mt-1 text-[11px] font-semibold text-emerald-700">Zona actual: {selectedZone?.name ?? "No seleccionada"}</p>



					<div className="mt-3 card-muted p-3.5">
						<button
							onClick={() => setMobileSection((prev) => prev === "quick" ? "" : "quick")}
							className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-left text-xs font-bold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 lg:hidden"
						>
							<span>Acciones rápidas</span>
							<span>{mobileSection === "quick" ? "Ocultar" : "Mostrar"}</span>
						</button>
						<div className={(mobileSection === "quick" ? "block" : "hidden") + " lg:block"}>
						<div className="mb-2">
							<input
								value={quickSearch}
								onChange={(e) => setQuickSearch(e.target.value)}
								placeholder="Buscar actuador..."
								className="card-input text-xs"
							/>
						</div>
						<div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
						{filteredSuggestedActuators.map((name) => (
							<div key={name} className={
								"card-surface p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md " +
								   "border-[#e5e0c3] bg-white/90"
							}>
								<div className="flex items-center gap-2">
									   <p className="text-sm font-semibold text-emerald-900">{name}</p>

								</div>
								<div className="mt-2 grid grid-cols-2 gap-2">
									<button
										onClick={() => {
											setActuatorName(name);
											setAction("ON");
											sendCommand("ON", name);
										}}
										disabled={sending || !allowOperate || !targetZoneId}
										className={
											"rounded-xl border px-2 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 " +
											   "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
										}
									>
										ON
									</button>
									<button
										onClick={() => {
											setActuatorName(name);
											setAction("OFF");
											sendCommand("OFF", name);
										}}
										disabled={sending || !allowOperate || !targetZoneId}
										className={
											"rounded-xl border px-2 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 " +
											   "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
										}
									>
										OFF
									</button>
								</div>
							</div>
						))}
						{filteredSuggestedActuators.length === 0 && (
							<div className="rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
								No hay actuadores que coincidan con la búsqueda.
							</div>
						)}
						</div>
						</div>
					</div>

					<div className="mt-4 card-muted p-3.5">
						<button
							onClick={() => setMobileSection((prev) => prev === "operator" ? "" : "operator")}
							className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-left text-xs font-bold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 lg:hidden"
						>
							<span>Modo operador</span>
							<span>{mobileSection === "operator" ? "Ocultar" : "Mostrar"}</span>
						</button>
						<div className={(mobileSection === "operator" ? "block" : "hidden") + " lg:block"}>
						<p className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Modo operador</p>
						<p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-300">Plantillas por zona para ejecutar secuencias en un clic.</p>
						<div className="mt-2 max-h-[240px] space-y-2 overflow-y-auto pr-1">
							{zoneTemplates.map((template) => (
								<div key={template.id} className="card-surface p-3 shadow-sm transition hover:shadow-md">
									<div className="flex items-center justify-between gap-2">
										<p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{template.name}</p>
										{isCustomTemplate(template.id) && (
											<button
												onClick={() => deleteTemplate(template.id)}
												className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:border-rose-600 dark:bg-rose-950/40 dark:text-rose-200"
											>
												Borrar
											</button>
										)}
									</div>
									<p className="mt-0.5 text-[11px] text-zinc-600 dark:text-zinc-300">{template.description}</p>
									<p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">Pasos: {template.steps.map((s) => `${s.actuatorName}:${s.action}`).join(" | ")}</p>
									<button
										onClick={() => runTemplate(template)}
										disabled={sending || runningTemplateId !== null || !allowOperate || !targetZoneId}
										className="mt-2 w-full rounded-xl bg-emerald-600 px-2 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
									>
										{runningTemplateId === template.id ? "Ejecutando..." : "Ejecutar plantilla"}
									</button>
								</div>
							))}
						</div>
						{templateFeedback && (
							<p className="mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">{templateFeedback}</p>
						)}

						<div className="mt-3 rounded-xl border border-zinc-200 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-950">
							<button
								onClick={() => setShowTemplateEditor((prev) => !prev)}
								className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-left text-xs font-bold uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
							>
								<span>Nueva plantilla</span>
								<span>{showTemplateEditor ? "Ocultar" : "Mostrar"}</span>
							</button>

							{showTemplateEditor && (
								<>
							<input
								value={newTemplateName}
								onChange={(e) => setNewTemplateName(e.target.value)}
								placeholder="Nombre"
								className="card-input text-xs mt-2"
							/>
							<input
								value={newTemplateDescription}
								onChange={(e) => setNewTemplateDescription(e.target.value)}
								placeholder="Descripción"
								className="card-input text-xs mt-2"
							/>
							<div className="mt-2 space-y-1.5">
								{newTemplateSteps.map((step, idx) => (
									<div key={`step-${idx}`} className="grid grid-cols-[1fr_auto_auto] gap-1.5">
										<input
											value={step.actuatorName}
											onChange={(e) => updateTemplateStep(idx, "actuatorName", e.target.value)}
											placeholder="Actuador"
											className="card-input text-xs"
										/>
										<select
											value={step.action}
											onChange={(e) => updateTemplateStep(idx, "action", e.target.value)}
											className="card-input text-xs"
										>
											<option value="ON">ON</option>
											<option value="OFF">OFF</option>
										</select>
										<button
											onClick={() => removeTemplateStep(idx)}
											className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-[10px] font-semibold text-rose-700 dark:border-rose-600 dark:bg-rose-950/40 dark:text-rose-200"
										>
											X
										</button>
									</div>
								))}
							</div>
							<div className="mt-2 flex gap-1.5">
								<button
									onClick={addTemplateStep}
									className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-[10px] font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
								>
									+ Paso
								</button>
								<button
									onClick={createTemplate}
									disabled={!allowOperate || !targetZoneId}
									className="rounded-lg bg-emerald-600 px-2 py-1.5 text-[10px] font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
								>
									Guardar plantilla
								</button>
							</div>
								</>
							)}
						</div>
						</div>
					</div>
				</div>
			</div>



			<div className="card-surface">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100">Historial local de comandos</h2>
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 text-xs dark:border-zinc-700 dark:bg-zinc-950">
						<button
							onClick={() => setHistoryFilter("ALL")}
							className={(historyFilter === "ALL" ? "bg-emerald-600 text-white " : "text-zinc-700 ") + "rounded-lg px-2.5 py-1.5 font-semibold transition"}
						>
							Todos
						</button>
						<button
							onClick={() => setHistoryFilter("SENT")}
							className={(historyFilter === "SENT" ? "bg-emerald-600 text-white " : "text-zinc-700 ") + "rounded-lg px-2.5 py-1.5 font-semibold transition"}
						>
							Enviados
						</button>
						<button
							onClick={() => setHistoryFilter("ERROR")}
							className={(historyFilter === "ERROR" ? "bg-rose-600 text-white " : "text-zinc-700 ") + "rounded-lg px-2.5 py-1.5 font-semibold transition"}
						>
							Error
						</button>
						</div>
						<select
							value={historySort}
							onChange={(e) => setHistorySort(e.target.value)}
							className="rounded-xl border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
						>
							<option value="DATE_DESC">Recientes</option>
							<option value="DATE_ASC">Antiguos</option>
							<option value="ACTUATOR_ASC">Actuador A-Z</option>
							<option value="STATUS">Estado</option>
						</select>
						<button
							onClick={exportHistoryCsv}
							disabled={displayedHistory.length === 0}
							className="rounded-xl border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Exportar CSV
						</button>
						<button
							onClick={retryAllFailed}
							disabled={failedVisibleCount === 0 || retryingAll || sending}
							className="rounded-xl bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{retryingAll ? "Reintentando..." : `Reintentar fallidos (${failedVisibleCount})`}
						</button>
					</div>
				</div>
<p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">Registro de la sesión actual (éxitos y fallos).</p>

				{history.length === 0 ? (
					<div className="mt-3 rounded-xl border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">Aún no has enviado comandos.</div>
				) : (
					<div className="mt-3 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-700">
						<table className="min-w-full text-left text-sm">
							<thead>
								<tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
									<th className="px-2 py-2">Hora</th>
									<th className="px-2 py-2">Zona</th>
									<th className="px-2 py-2">Actuador</th>
									<th className="px-2 py-2">Acción</th>
									<th className="px-2 py-2">Estado</th>
									<th className="px-2 py-2">Detalle</th>
									<th className="px-2 py-2">Reintento</th>
								</tr>
							</thead>
							<tbody>
								{displayedHistory.map((item) => (
									<tr key={item.id} className="border-b border-zinc-200 odd:bg-white even:bg-zinc-50 transition hover:bg-zinc-100 dark:odd:bg-zinc-950 dark:even:bg-zinc-900 dark:hover:bg-zinc-800">
										<td className="px-2 py-2 text-zinc-600">
											{new Date(item.sentAt).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
										</td>
										<td className="px-2 py-2">{item.zoneName}</td>
										<td className="px-2 py-2">{item.actuatorName}</td>
										<td className="px-2 py-2">
											<span className={"rounded-full px-2 py-0.5 text-[11px] font-bold " + (item.action === "ON" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>{item.action}</span>
										</td>
										<td className="px-2 py-2">
											<span className={"rounded px-2 py-0.5 text-xs font-semibold " + (item.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
												{item.ok ? "Enviado" : "Error"}
											</span>
										</td>
										<td className="max-w-[260px] truncate px-2 py-2 text-xs text-zinc-600" title={item.message ?? "-"}>{item.message ?? "-"}</td>
										<td className="px-2 py-2">
											{!item.ok ? (
												<button
													onClick={() => retryHistoryItem(item)}
													disabled={sending || retryingHistoryId === item.id}
													className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
												>
													{retryingHistoryId === item.id ? "Reintentando..." : "Reintentar"}
												</button>
											) : (
												<span className="text-xs text-zinc-500">-</span>
											)}
										</td>
									</tr>
								))}
								{displayedHistory.length === 0 && (
									<tr>
										<td className="px-2 py-3 text-xs text-zinc-600" colSpan={7}>
											No hay registros para el filtro seleccionado.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}

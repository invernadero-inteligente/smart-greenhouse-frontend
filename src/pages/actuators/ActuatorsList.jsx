import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useZones } from "../../hooks/useZonesList";
import { canOperate, canEdit } from "../../utils/permissions";
import { actuatorService } from "../../services/actuator.service";
import { getApiErrorMessage } from "../../services/api";

import ActuatorCard from "./ActuatorCard";
import EmptyState from "./EmptyState";
import SkeletonCard from "./SkeletonCard";

import {
  FiCpu,
  FiWifi,
  FiPlus,
  FiZap,
  FiAlertTriangle,
  FiActivity,
} from "react-icons/fi";

import { motion, AnimatePresence } from "framer-motion";

export default function ActuatorsList() {
  const { auth } = useAuth();
  const { zones, loading: loadingZones } = useZones();

  const allowOperate = canOperate(auth.role);
  const allowEdit = canEdit(auth.role);

  // =========================================================
  // STATES
  // =========================================================

  const [selectedZoneId, setSelectedZoneId] =
    useState("");

  const [actuators, setActuators] = useState([]);

  const [loadingActuators, setLoadingActuators] =
    useState(true);

  const [mqttConnected] = useState(true);

  // mensajes
  const [sendLoading, setSendLoading] =
    useState(false);

  const [sendError, setSendError] =
    useState("");

  const [sendSuccess, setSendSuccess] =
    useState("");

  // crear actuador
  const [newActuatorZone, setNewActuatorZone] =
    useState("");

  const [newActuatorName, setNewActuatorName] =
    useState("");

  const [newActuatorState, setNewActuatorState] =
    useState("OFF");

  const [creatingActuator, setCreatingActuator] =
    useState(false);

  const [createError, setCreateError] =
    useState("");

  const [createSuccess, setCreateSuccess] =
    useState("");

  // auditoría
  const [auditLogs, setAuditLogs] = useState([]);

  // =========================================================
  // ZONAS
  // =========================================================

  const zonesList = useMemo(() => {
    return Array.isArray(zones) ? zones : [];
  }, [zones]);

  const targetZoneId =
    selectedZoneId ||
    (zonesList[0]?.id
      ? String(zonesList[0].id)
      : "");

  const selectedZone = zonesList.find(
    (zone) =>
      String(zone.id) ===
      String(targetZoneId)
  );

  // =========================================================
  // LOAD ACTUATORS
  // =========================================================

  const loadActuators = async () => {
    setLoadingActuators(true);

    try {
      const response =
        await actuatorService.listActuators(
          selectedZoneId || null
        );

      const data =
        response?.data ||
        response ||
        [];

      setActuators(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error listando actuadores:",
        error
      );

      setActuators([]);
    } finally {
      setLoadingActuators(false);
    }
  };

  useEffect(() => {
    loadActuators();
  }, [selectedZoneId]);

  // =========================================================
  // TOGGLE ON/OFF
  // =========================================================

  const handleToggle = async (actuator) => {
    if (!allowOperate) return;

    setSendLoading(true);
    setSendError("");
    setSendSuccess("");

    try {
      const actuatorId = actuator?.id;

      if (!actuatorId) {
        throw new Error(
          "El actuador no tiene ID válido"
        );
      }

      const currentState =
        actuator?.currentAction || "OFF";

      const nextAction =
        currentState === "ON"
          ? "OFF"
          : "ON";

      // ========================================
      // ENVÍO COMANDO
      // ========================================

      await actuatorService.sendCommand(
        actuatorId,
        nextAction
      );

      // ========================================
      // UPDATE LOCAL INMEDIATO
      // ========================================

      setActuators((prev) =>
        prev.map((item) =>
          item.id === actuatorId
            ? {
                ...item,
                currentAction:
                  nextAction,
                updatedAt:
                  new Date().toISOString(),
              }
            : item
        )
      );

      // ========================================
      // AUDITORÍA
      // ========================================

      setAuditLogs((prev) => [
        {
          id: Date.now(),
          actuator: actuator.name,
          action: nextAction,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);

      setSendSuccess(
        `Comando ${nextAction} enviado a ${actuator.name}`
      );

      // refresco backend
      setTimeout(async () => {
        await loadActuators();
      }, 700);

      setTimeout(() => {
        setSendSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setSendError(
        getApiErrorMessage(err)
      );

      setTimeout(() => {
        setSendError("");
      }, 5000);
    } finally {
      setSendLoading(false);
    }
  };

  // =========================================================
  // CREATE ACTUATOR
  // =========================================================

  const handleCreateActuator = async (
    e
  ) => {
    e.preventDefault();

    setCreateError("");
    setCreateSuccess("");
    setCreatingActuator(true);

    try {
      await actuatorService.createActuator({
        zoneId: Number(
          newActuatorZone
        ),
        name: newActuatorName.trim(),
        currentAction:
          newActuatorState,
      });

      setCreateSuccess(
        "Actuador creado correctamente"
      );

      setNewActuatorZone("");
      setNewActuatorName("");
      setNewActuatorState("OFF");

      await loadActuators();

      setTimeout(() => {
        setCreateSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Error creando actuador:",
        err
      );

      setCreateError(
        getApiErrorMessage(err)
      );
    } finally {
      setCreatingActuator(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight flex items-center gap-3">
            <FiCpu
              className="text-emerald-500"
              size={28}
            />
            Control de actuadores
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="inline-flex items-center gap-2 text-sm text-zinc-600 font-medium">
              <FiWifi
                className={
                  mqttConnected
                    ? "text-emerald-500"
                    : "text-rose-400 animate-pulse"
                }
              />

              MQTT{" "}
              {mqttConnected
                ? "conectado"
                : "desconectado"}
            </span>

            <span className="inline-flex items-center gap-2 text-sm text-zinc-600 font-medium">
              Zona:
              <span className="font-bold text-emerald-700">
                {selectedZone?.name ??
                  "Sin zona"}
              </span>
            </span>

            <span className="inline-flex items-center gap-2 text-sm text-zinc-600 font-medium">
              <FiZap className="text-emerald-500" />
              {loadingActuators
                ? "-"
                : actuators.length}{" "}
              actuadores
            </span>
          </div>
        </div>

        <div>
          <select
            value={targetZoneId}
            onChange={(e) =>
              setSelectedZoneId(
                e.target.value
              )
            }
            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
            disabled={
              loadingZones ||
              zonesList.length === 0
            }
          >
            {zonesList.length === 0 && (
              <option value="">
                Sin zonas activas
              </option>
            )}

            {zonesList.map((zone) => (
              <option
                key={zone.id}
                value={zone.id}
              >
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================================================= */}
      {/* GRID */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================================================= */}
        {/* FORM CREAR */}
        {/* ================================================= */}

        {allowEdit && (
          <motion.div
            className="rounded-3xl bg-white border border-zinc-200 shadow-xl p-7 h-fit"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2 mb-6">
              <FiPlus className="text-emerald-500" />
              Nuevo actuador
            </h2>

            <form
              onSubmit={
                handleCreateActuator
              }
              className="flex flex-col gap-4"
            >
              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1 block">
                  Zona
                </label>

                <select
                  value={newActuatorZone}
                  onChange={(e) =>
                    setNewActuatorZone(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  required
                >
                  <option value="">
                    Selecciona zona
                  </option>

                  {zonesList.map((z) => (
                    <option
                      key={z.id}
                      value={z.id}
                    >
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1 block">
                  Nombre
                </label>

                <input
                  value={newActuatorName}
                  onChange={(e) =>
                    setNewActuatorName(
                      e.target.value
                    )
                  }
                  placeholder="Ej. BOMBA"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-zinc-700 mb-1 block">
                  Estado inicial
                </label>

                <select
                  value={newActuatorState}
                  onChange={(e) =>
                    setNewActuatorState(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                >
                  <option value="OFF">
                    OFF
                  </option>

                  <option value="ON">
                    ON
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={
                  creatingActuator
                }
                className="mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 transition-all text-white font-semibold py-3 shadow-lg disabled:opacity-50"
              >
                {creatingActuator
                  ? "Creando..."
                  : "Crear actuador"}
              </button>

              {createError && (
                <div className="rounded-xl bg-rose-100 text-rose-700 px-4 py-3 text-sm">
                  {createError}
                </div>
              )}

              {createSuccess && (
                <div className="rounded-xl bg-emerald-100 text-emerald-700 px-4 py-3 text-sm">
                  {createSuccess}
                </div>
              )}
            </form>
          </motion.div>
        )}

        {/* ================================================= */}
        {/* ACTUADORES */}
        {/* ================================================= */}

        <motion.div
          className={`rounded-3xl bg-white border border-zinc-200 shadow-xl p-7 flex flex-col gap-6 ${
            allowEdit
              ? "lg:col-span-2"
              : "lg:col-span-3"
          }`}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          {/* TOP */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-100 pb-5">
            <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
              <FiCpu className="text-emerald-500" />
              Actuadores registrados
            </h2>

            <div className="min-h-[36px]">
              <AnimatePresence mode="wait">
                {sendError && (
                  <motion.div
                    key="error"
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 20,
                    }}
                    className="rounded-xl bg-rose-100 text-rose-700 px-4 py-2 text-sm font-medium"
                  >
                    {sendError}
                  </motion.div>
                )}

                {sendSuccess && (
                  <motion.div
                    key="success"
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 20,
                    }}
                    className="rounded-xl bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-medium"
                  >
                    {sendSuccess}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* GRID */}
          {loadingActuators ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map(
                (_, i) => (
                  <SkeletonCard
                    key={i}
                  />
                )
              )}
            </div>
          ) : actuators.length === 0 ? (
            <EmptyState
              icon={
                <FiAlertTriangle
                  size={40}
                />
              }
              title="No hay actuadores"
              description="Crea uno para comenzar."
              cta={null}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AnimatePresence>
                {actuators.map((act) => (
                  <ActuatorCard
                    key={act.id}
                    actuator={act}
                    onToggle={
                      handleToggle
                    }
                    loading={
                      sendLoading
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ================================================= */}
          {/* AUDITORÍA */}
          {/* ================================================= */}

          <div className="mt-6 border-t border-zinc-100 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="text-emerald-500" />
              <h3 className="text-lg font-bold text-zinc-800">
                Auditoría reciente
              </h3>
            </div>

            {auditLogs.length === 0 ? (
              <div className="text-sm text-zinc-500">
                Aún no hay registros.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-semibold text-zinc-800">
                        {log.actuator}
                      </div>

                      <div className="text-xs text-zinc-500 mt-1">
                        Cambio de estado
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          log.action ===
                          "ON"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {log.action}
                      </span>

                      <span className="text-xs text-zinc-400">
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
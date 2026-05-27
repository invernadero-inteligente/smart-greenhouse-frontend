import { useState } from "react";
import { useZones } from "../../../hooks/useZones";
import { listRegisteredSensors, registerSensor, setRegisteredSensorActive } from "../../../utils/sensorRegistry";
import SensorCard from "./SensorCard";

export default function SensorCatalogManager() {
  const { zones } = useZones();
  const [registeredSensors, setRegisteredSensors] = useState(() => listRegisteredSensors());
  const [sensorForm, setSensorForm] = useState({ zoneId: "", alias: "", variable: "", unit: "" });
  const [sensorFormError, setSensorFormError] = useState("");
  const [sensorFormSuccess, setSensorFormSuccess] = useState("");

  const handleSensorFormChange = (e) => {
    const { name, value } = e.target;
    setSensorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSensor = (e) => {
    e.preventDefault();
    setSensorFormError("");
    setSensorFormSuccess("");
    if (!sensorForm.zoneId) {
      setSensorFormError("Selecciona una zona válida");
      return;
    }
    if (!sensorForm.variable) {
      setSensorFormError("Variable requerida");
      return;
    }
    try {
      registerSensor({ ...sensorForm });
      setRegisteredSensors(listRegisteredSensors());
      setSensorFormSuccess("Sensor registrado en catálogo local");
      setSensorForm({ zoneId: "", alias: "", variable: "", unit: "" });
    } catch (err) {
      setSensorFormError("Error al registrar sensor");
    }
  };

  const handleSensorStatus = (id, active) => {
    setRegisteredSensorActive(id, active);
    setRegisteredSensors(listRegisteredSensors());
  };

  return (
    <section className="rounded-3xl bg-gradient-to-br from-[#f5f3e7]/80 to-white/90 border border-[#e5e0c3] shadow-xl p-6 mt-4">
      <h3 className="font-heading text-lg font-bold text-emerald-900 mb-2">Catálogo manual de sensores</h3>
      <form onSubmit={handleRegisterSensor} className="grid gap-3 md:grid-cols-5 mb-4">
        <select
          name="zoneId"
          value={sensorForm.zoneId}
          onChange={handleSensorFormChange}
          className="rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-emerald-900"
        >
          <option value="">Selecciona zona</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
        <input
          name="alias"
          value={sensorForm.alias}
          onChange={handleSensorFormChange}
          placeholder="Alias (ej: Sensor Camellón A)"
          className="rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-emerald-900"
        />
        <input
          name="variable"
          value={sensorForm.variable}
          onChange={handleSensorFormChange}
          placeholder="Variable (ej: TEMPERATURE)"
          className="rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-emerald-900"
        />
        <input
          name="unit"
          value={sensorForm.unit}
          onChange={handleSensorFormChange}
          placeholder="Unidad (ej: C)"
          className="rounded-lg border border-[#e5e0c3] bg-white px-3 py-2 text-sm text-emerald-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
        >
          Registrar sensor
        </button>
      </form>
      {sensorFormError && (
        <div className="mt-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {sensorFormError}
        </div>
      )}
      {sensorFormSuccess && (
        <div className="mt-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
          {sensorFormSuccess}
        </div>
      )}
      <div className="mt-4">
        <h4 className="font-semibold text-emerald-900 mb-2 text-sm">Sensores registrados</h4>
        {registeredSensors.length === 0 ? (
          <p className="text-sm text-emerald-700/60">Aún no hay sensores registrados manualmente.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {registeredSensors.map((sensor) => (
              <div key={sensor.id} className={sensor.isActive ? "" : "opacity-70"}>
                <SensorCard sensor={{
                  variable: sensor.alias || sensor.variable,
                  value: "--",
                  unit: sensor.unit,
                  status: sensor.isActive === false ? "UNKNOWN" : "NORMAL",
                  zoneName: zones.find(z => z.id === sensor.zoneId)?.name || "Zona",
                  zoneOnline: false,
                  timestamp: sensor.updatedAt
                }} />
                <div className="mt-2 flex items-center justify-between px-1">
                  <p className="text-xs text-emerald-700/60">
                    {zones.find(z => z.id === sensor.zoneId)?.name || "Zona"} · {sensor.alias || sensor.variable}
                  </p>
                  {sensor.isActive ? (
                    <button
                      onClick={() => handleSensorStatus(sensor.id, false)}
                      className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25"
                    >
                      Baja lógica
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSensorStatus(sensor.id, true)}
                      className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25"
                    >
                      Reactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

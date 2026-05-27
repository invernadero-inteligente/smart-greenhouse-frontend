import { useEffect, useState } from "react";
import { actuatorService } from "../../services/actuator.service";
import { useZones } from "../../hooks/useZones";

export default function ActuatorAdmin() {
  const { zones, loading: loadingZones } = useZones(true);
  const [zoneId, setZoneId] = useState("");
  const [name, setName] = useState("");
  const [actuators, setActuators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchActuators = async () => {
    setLoading(true);
    try {
      const data = await actuatorService.listActuators();
      setActuators(data);
    } catch {
      setActuators([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActuators();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editId) {
        await actuatorService.updateActuator({ id: editId, zoneId, name });
        setSuccess("Actuador actualizado");
      } else {
        await actuatorService.createActuator({ zoneId, name });
        setSuccess("Actuador creado");
      }
      setName("");
      setZoneId("");
      setEditId(null);
      fetchActuators();
    } catch (err) {
      setError(err.message || "Error");
    }
  };

  const handleEdit = (act) => {
    setEditId(act.id);
    setZoneId(act.zone.id);
    setName(act.name);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar actuador?")) return;
    setError("");
    setSuccess("");
    try {
      await actuatorService.deleteActuator(id);
      setSuccess("Actuador eliminado");
      fetchActuators();
    } catch (err) {
      setError(err.message || "Error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border border-[#e5e0c3] shadow">
      <h2 className="font-heading text-xl font-bold text-emerald-900 mb-4">Gestión de Actuadores</h2>
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div>
          <label className="block text-xs font-semibold text-emerald-700 mb-1">Zona</label>
          <select
            value={zoneId}
            onChange={e => setZoneId(e.target.value)}
            className="card-input"
            disabled={loadingZones}
            required
          >
            <option value="">Selecciona zona</option>
            {zones?.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-emerald-700 mb-1">Nombre del actuador</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="card-input"
            placeholder="Ej. BombaRiego"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          disabled={loadingZones || !zoneId || !name.trim()}
        >
          {editId ? "Actualizar" : "Crear"}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setName(""); setZoneId(""); }} className="ml-2 text-xs text-emerald-700 underline">Cancelar edición</button>
        )}
      </form>
      {error && <div className="mb-3 rounded bg-rose-100 text-rose-700 px-3 py-2 text-sm">{error}</div>}
      {success && <div className="mb-3 rounded bg-emerald-100 text-emerald-700 px-3 py-2 text-sm">{success}</div>}
      <h3 className="font-heading text-lg font-bold text-emerald-900 mb-2">Lista de actuadores</h3>
      <table className="min-w-full text-sm border border-[#e5e0c3] rounded-xl bg-white">
        <thead>
          <tr className="bg-[#FAF7F2] text-emerald-700">
            <th className="px-2 py-2">Zona</th>
            <th className="px-2 py-2">Nombre</th>
            <th className="px-2 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3} className="text-center py-4">Cargando...</td></tr>
          ) : actuators.length === 0 ? (
            <tr><td colSpan={3} className="text-center py-4">Sin actuadores</td></tr>
          ) : actuators.map(act => (
            <tr key={act.id} className="border-t border-[#e5e0c3]">
              <td className="px-2 py-2">{act.zone?.name}</td>
              <td className="px-2 py-2">{act.name}</td>
              <td className="px-2 py-2">
                <button onClick={() => handleEdit(act)} className="text-xs text-emerald-700 underline mr-2">Editar</button>
                <button onClick={() => handleDelete(act.id)} className="text-xs text-rose-700 underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

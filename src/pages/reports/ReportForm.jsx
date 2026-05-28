import { useState } from 'react';
import { useZones } from '../../hooks/useZonesList'; // <-- Importación corregida a tu archivo real
import { motion } from 'framer-motion';
import { generateReport } from '../../services/report.service';
import { useAuth } from '../../hooks/useAuth';

const REPORT_TYPES = [
  { value: 'ALERTS', label: 'Alertas' },
  { value: 'INVENTORY', label: 'Inventario' },
  { value: 'PRODUCTION', label: 'Producción' },
];

function PdfIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2">
      <rect x="8" y="4" width="32" height="40" rx="4" fill="#2f7f3c"/>
      <rect x="12" y="8" width="24" height="32" rx="2" fill="#fffbe9"/>
      <rect x="16" y="16" width="16" height="2.5" rx="1.25" fill="#2f7f3c"/>
      <rect x="16" y="22" width="16" height="2.5" rx="1.25" fill="#2f7f3c"/>
      <rect x="16" y="28" width="10" height="2.5" rx="1.25" fill="#2f7f3c"/>
    </svg>
  );
}

export default function ReportForm() {
  const { token } = useAuth();
  const [type, setType] = useState('ALERTS');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [zoneId, setZoneId] = useState('');
  
  const { zones, loading: loadingZones } = useZones();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await generateReport(
        { type, from, to, zoneId: zoneId || undefined },
        token
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleDownload}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', bounce: 0.18 }}
      className="w-full max-w-md p-6 md:p-10 shadow-lg rounded-3xl border border-[var(--secondary)] bg-[#fffdf5]/95 flex flex-col gap-2 items-center"
      style={{ boxSizing: 'border-box' }}
    >
      <PdfIcon />
      
      <div className="mb-6 text-center w-full">
        <h2 className="text-2xl font-extrabold text-[var(--primary)] mb-1 tracking-tight">Generar reporte PDF</h2>
        <p className="text-[var(--muted)] text-base">Descarga reportes institucionales en PDF según los filtros seleccionados.</p>
      </div>

      <div className="mb-4 w-full">
        <label className="block mb-1 font-medium text-[var(--fg)]">Tipo de reporte</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full border border-[var(--border)] rounded-lg p-2 bg-[var(--input-bg)] focus:ring-2 focus:ring-[var(--ring)]"
        >
          {REPORT_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 w-full flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <label className="block mb-1 font-medium text-[var(--fg)]">Desde</label>
          <input
            type="datetime-local"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg p-2 bg-[var(--input-bg)] focus:ring-2 focus:ring-[var(--ring)]"
            required
          />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block mb-1 font-medium text-[var(--fg)]">Hasta</label>
          <input
            type="datetime-local"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg p-2 bg-[var(--input-bg)] focus:ring-2 focus:ring-[var(--ring)]"
            required
          />
        </div>
      </div>

      {(type === 'ALERTS' || type === 'PRODUCTION') && (
        <div className="mb-4 w-full">
          <label className="block mb-1 font-medium text-[var(--fg)]">Zona (opcional)</label>
          <select
            value={zoneId}
            onChange={e => setZoneId(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg p-2 bg-[var(--input-bg)] focus:ring-2 focus:ring-[var(--ring)]"
            disabled={loadingZones}
          >
            <option value="">Todas las zonas</option>
            {zones && zones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg font-semibold bg-[var(--primary)] text-white hover:bg-green-800 transition-colors mt-2 disabled:opacity-60 shadow-md"
        style={{ minWidth: 0 }}
      >
        {loading ? 'Generando...' : 'Descargar PDF'}
      </button>

      {error && (
        <div className="text-[var(--destructive)] mt-3 text-center text-sm font-medium">
          {error}
        </div>
      )}
    </motion.form>
  );
}
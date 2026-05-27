// Servicio para generar y descargar reportes PDF
export async function generateReport({ type, from, to, zoneId }, token) {
  const body = { type, from, to };
  if (zoneId) body.zoneId = zoneId;

  const response = await fetch('/api/reports/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error ${response.status}: ${error}`);
  }

  const disposition = response.headers.get('Content-Disposition');
  let filename = 'reporte.pdf';
  if (disposition && disposition.includes('filename=')) {
    filename = disposition.split('filename=')[1].replace(/"/g, '');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

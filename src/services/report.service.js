import { api } from './api';

export const generateReport = async ({ type, from, to, zoneId }, token) => {
  try {
    const payload = {
      type,
      from,
      to,
    };

    if (zoneId) {
      payload.zoneId = Number(zoneId);
    }

    // responseType 'blob' es CRÍTICO para descargar PDFs
    const response = await api.post('/api/reports/generate', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    let filename = `reporte_${type.toLowerCase()}.pdf`;
    const disposition = response.headers['content-disposition'];
    
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) { 
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error al descargar el PDF:", error);
    
    if (error.response && error.response.data && error.response.data instanceof Blob) {
      const text = await error.response.data.text();
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Error al generar el reporte");
      } catch (e) {
        throw new Error("Error interno del servidor al generar el PDF");
      }
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Error de conexión');
  }
};
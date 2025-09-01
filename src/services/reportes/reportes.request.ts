import apiClient from '../apiClient';

export interface CargosEntregaParams {
    fechaInicio: string; // formato: YYYY-MM-DD
    fechaFin: string;    // formato: YYYY-MM-DD
}

export const generateCargosEntregaReport = async (params: CargosEntregaParams): Promise<void> => {
    try {
        const response = await apiClient.get('/reportes/cargos-entrega', {
            params,
            responseType: 'blob', // Importante para recibir el PDF como blob
        });

        // Crear URL para el blob
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Crear enlace temporal para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = `cargos-entrega-${params.fechaInicio}-${params.fechaFin}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error generando reporte de cargos de entrega:', error);
        throw error;
    }
};

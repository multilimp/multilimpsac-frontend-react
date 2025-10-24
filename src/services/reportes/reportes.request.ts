import apiClient from '../apiClient';

export interface CargosEntregaParams {
    fechaInicio: string; // formato: YYYY-MM-DD
    fechaFin: string;    // formato: YYYY-MM-DD
}

export const generateCargosEntregaReport = async (params: CargosEntregaParams): Promise<void> => {
    try {
        const response = await apiClient.get('/print/cargos-entrega', {
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
        console.error('Error generando reporte de Reporte de Programación:', error);
        throw error;
    }
};

export const previewCargosEntregaReport = async (params: CargosEntregaParams): Promise<void> => {
    try {
        // Usar ruta pública para previsualización (sin autenticación)
        const response = await apiClient.get('/print/cargos-entrega/html', {
            params,
        });

        // Abrir el HTML en una nueva pestaña
        const htmlContent = response.data;
        const newTab = window.open('', '_blank');

        if (newTab) {
            newTab.document.write(htmlContent);
            newTab.document.close();

            // El script en el HTML se encargará de abrir el diálogo de impresión automáticamente
        } else {
            // Fallback si el popup está bloqueado
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cargos-entrega-print-${params.fechaInicio}-${params.fechaFin}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            throw new Error('No se pudo abrir la nueva pestaña. Verifica que los popups estén habilitados.');
        }

    } catch (error) {
        console.error('Error imprimiendo reporte de Reporte de Programación:', error);
        throw error;
    }
};

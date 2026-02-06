import apiClient from '../apiClient';
import * as XLSX from 'xlsx';

// ============= TIPOS =============
export interface ReportesParams {
    year: number;
    mesInicio?: number;
    mesFin?: number;
}

export interface VentasReportParams extends ReportesParams {
    filtroRango?: string;
}

export interface CobranzaReportParams {
    year: number;
    etapas?: string[];
}

export interface RankingReportParams {
    year: number;
    mes?: number;
    region?: string;
}

export interface UtilidadReportParams extends ReportesParams {
    empresaId?: number;
}

// ============= FUNCIONES DE API =============
export const fetchVentasReport = async (params: VentasReportParams) => {
    const queryParams = new URLSearchParams({
        year: String(params.year),
        mesInicio: String(params.mesInicio || 1),
        mesFin: String(params.mesFin || 12),
        ...(params.filtroRango && { filtroRango: params.filtroRango }),
    });

    const response = await apiClient.get(`/reports/ventas?${queryParams}`);
    return response.data;
};

export const fetchEntregasReport = async (params: ReportesParams) => {
    const queryParams = new URLSearchParams({
        year: String(params.year),
        mesInicio: String(params.mesInicio || 1),
        mesFin: String(params.mesFin || 12),
    });

    const response = await apiClient.get(`/reports/entregas?${queryParams}`);
    return response.data;
};

export const fetchCobranzaReport = async (params: CobranzaReportParams) => {
    const queryParams = new URLSearchParams({
        year: String(params.year),
        ...(params.etapas && params.etapas.length > 0 && { etapas: params.etapas.join(',') }),
    });

    const response = await apiClient.get(`/reports/cobranza?${queryParams}`);
    return response.data;
};

export const fetchRankingReport = async (params: RankingReportParams) => {
    const queryParams = new URLSearchParams({
        year: String(params.year),
        ...(params.mes && { mes: String(params.mes) }),
        ...(params.region && { region: params.region }),
    });

    const response = await apiClient.get(`/reports/ranking?${queryParams}`);
    return response.data;
};

export const fetchUtilidadReport = async (params: UtilidadReportParams) => {
    const queryParams = new URLSearchParams({
        year: String(params.year),
        mesInicio: String(params.mesInicio || 1),
        mesFin: String(params.mesFin || 12),
        ...(params.empresaId && { empresaId: String(params.empresaId) }),
    });

    const response = await apiClient.get(`/reports/utilidad?${queryParams}`);
    return response.data;
};

// ============= FUNCIONES DE EXPORTACIÓN EXCEL =============
/**
 * Función genérica para exportar datos a Excel
 * @param data - Array de objetos con los datos
 * @param fileName - Nombre del archivo Excel
 * @param sheetName - Nombre de la hoja (por defecto "Datos")
 */
export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Datos') => {
    if (!data || data.length === 0) {
        console.warn('No hay datos para exportar');
        return;
    }

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Ajustar ancho de columnas
    const maxWidth = 20;
    const colWidths = Object.keys(data[0]).map((key) => ({
        wch: Math.min(maxWidth, Math.max(key.length, 10)),
    }));
    ws['!cols'] = colWidths;

    // Descargar archivo
    XLSX.writeFile(wb, `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar reporte de Ventas a Excel
 */
export const exportVentasReport = (reportData: any) => {
    const { tabla, resumen, mensualAnual } = reportData;

    // Crear sheet de resumen
    const resumeData = [
        { Concepto: 'Período', Valor: `${resumen.año} (Mes ${resumen.mesInicio} - ${resumen.mesFin})` },
        { Concepto: 'Total de Ventas', Valor: `S/ ${resumen.totalVentas.toFixed(2)}` },
        { Concepto: 'Cantidad de Órdenes', Valor: resumen.cantidadOrdenes },
        { Concepto: 'Utilidad Total', Valor: `S/ ${resumen.utilidadTotal.toFixed(2)}` },
        { Concepto: 'Utilidad Promedio (%)', Valor: `${resumen.porcentajeUtilidadPromedio.toFixed(2)}%` },
    ];

    const wsResumen = XLSX.utils.json_to_sheet(resumeData);
    const wsTabla = XLSX.utils.json_to_sheet(tabla);
    const mensualData = (mensualAnual?.meses || []).map((mes: string, i: number) => ({
        Mes: mes,
        TotalVentas: mensualAnual?.datos?.[i] ?? 0,
    }));
    const wsMensual = XLSX.utils.json_to_sheet(mensualData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsMensual, 'Mensual');
    XLSX.utils.book_append_sheet(wb, wsTabla, 'Detalle');

    XLSX.writeFile(wb, `Reporte-Ventas-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar reporte de Entregas a Excel
 */
export const exportEntregasReport = (reportData: any) => {
    const { tabla, resumen } = reportData;

    const resumeData = [
        { Concepto: 'Período', Valor: `${resumen.año} (Mes ${resumen.mesInicio} - ${resumen.mesFin})` },
        { Concepto: 'Total de Órdenes', Valor: resumen.totalOrdenes },
        { Concepto: 'Entregas Conformes', Valor: resumen.conformes },
        { Concepto: 'Entregas No Conformes', Valor: resumen.noConformes },
        { Concepto: 'Entregas Pendientes', Valor: resumen.pendientes },
        { Concepto: 'Conformidad (%)', Valor: `${resumen.porcentajeConformidad.toFixed(2)}%` },
    ];

    const wsResumen = XLSX.utils.json_to_sheet(resumeData);
    const wsTabla = XLSX.utils.json_to_sheet(tabla);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsTabla, 'Detalle');

    XLSX.writeFile(wb, `Reporte-Entregas-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar reporte de Cobranza a Excel
 */
export const exportCobranzaReport = (reportData: any) => {
    const { tabla, resumen, desgloseMensual } = reportData;

    const resumeData = [
        { Concepto: 'Año', Valor: resumen.año },
        { Concepto: 'Total de Órdenes', Valor: resumen.totalOrdenes },
        { Concepto: 'Monto Total', Valor: `S/ ${resumen.montoTotal.toFixed(2)}` },
        { Concepto: 'Monto Pendiente', Valor: `S/ ${resumen.montoPendiente.toFixed(2)}` },
    ];

    const wsResumen = XLSX.utils.json_to_sheet(resumeData);
    const wsTabla = XLSX.utils.json_to_sheet(tabla);
    const wsDesglose = XLSX.utils.json_to_sheet(desgloseMensual);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsTabla, 'Detalle');
    XLSX.utils.book_append_sheet(wb, wsDesglose, 'Mensual');

    XLSX.writeFile(wb, `Reporte-Cobranza-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar reporte de Ranking a Excel
 */
export const exportRankingReport = (reportData: any) => {
    const { topDepartamentos, topClientes, resumen } = reportData;

    const resumeData = [
        { Concepto: 'Año', Valor: resumen.año },
        ...(resumen.mes && [{ Concepto: 'Mes', Valor: resumen.mes }]),
        ...(resumen.región && [{ Concepto: 'Región', Valor: resumen.región }]),
        { Concepto: 'Total de Órdenes', Valor: resumen.totalOrdenes },
        { Concepto: 'Monto Total', Valor: `S/ ${resumen.montoTotal.toFixed(2)}` },
    ];

    const wsResumen = XLSX.utils.json_to_sheet(resumeData);
    const wsDeptos = XLSX.utils.json_to_sheet(topDepartamentos);
    const wsClientes = XLSX.utils.json_to_sheet(topClientes);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsDeptos, 'Top Departamentos');
    XLSX.utils.book_append_sheet(wb, wsClientes, 'Top Clientes');

    XLSX.writeFile(wb, `Reporte-Ranking-${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exportar reporte de Utilidad a Excel
 */
export const exportUtilidadReport = (reportData: any) => {
    const { tabla, resumen, detalleRangos } = reportData;

    const resumeData = [
        { Concepto: 'Período', Valor: `${resumen.año} (Mes ${resumen.mesInicio} - ${resumen.mesFin})` },
        { Concepto: 'Total de Órdenes', Valor: resumen.totalOrdenes },
        { Concepto: 'Total de Ventas', Valor: `S/ ${resumen.totalVentas.toFixed(2)}` },
        { Concepto: 'Total de Utilidad', Valor: `S/ ${resumen.totalUtilidad.toFixed(2)}` },
        { Concepto: 'Utilidad Promedio (%)', Valor: `${resumen.porcentajeUtilidadPromedio.toFixed(2)}%` },
    ];

    const wsResumen = XLSX.utils.json_to_sheet(resumeData);
    const wsTabla = XLSX.utils.json_to_sheet(tabla);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
    XLSX.utils.book_append_sheet(wb, wsTabla, 'Rangos de Utilidad');

    XLSX.writeFile(wb, `Reporte-Utilidad-${new Date().toISOString().split('T')[0]}.xlsx`);
};

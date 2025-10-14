export interface UtilidadCalculada {
    porcentaje: number;
    umbral: number;
    esAdecuado: boolean;
    mensaje: string;
    color: 'success' | 'error' | 'default';
}

export const calcularUtilidad = (montoVenta: number, costoProveedor: number): number => {
    if (montoVenta <= 0 || costoProveedor <= 0) return 0;
    return ((montoVenta - costoProveedor) / montoVenta) * 100;
};

export const obtenerUmbralUtilidad = (montoVenta: number): number => {
    if (montoVenta < 1000) return 30;
    if (montoVenta >= 1000 && montoVenta < 2000) return 20;
    if (montoVenta >= 2000 && montoVenta < 3000) return 18;
    return 10;
};

export const calcularUtilidadCompleta = (
    montoVenta: number | string | null | undefined,
    costoProveedor: number | string | null | undefined
): UtilidadCalculada => {
    const montoVentaNum = typeof montoVenta === 'string' ? parseFloat(montoVenta) : (montoVenta || 0);
    const costoProveedorNum = typeof costoProveedor === 'string' ? parseFloat(costoProveedor) : (costoProveedor || 0);

    if (montoVentaNum <= 0 || costoProveedorNum <= 0) {
        return {
            porcentaje: 0,
            umbral: 0,
            esAdecuado: false,
            mensaje: '-',
            color: 'default',
        };
    }

    const utilidad = calcularUtilidad(montoVentaNum, costoProveedorNum);
    const umbral = obtenerUmbralUtilidad(montoVentaNum);
    const esAdecuado = utilidad >= umbral;

    return {
        porcentaje: utilidad,
        umbral,
        esAdecuado,
        mensaje: esAdecuado
            ? 'Adecuado'
            : `Inferior ${utilidad.toFixed(2)}% de ${umbral}%`,
        color: esAdecuado ? 'success' : 'error',
    };
};

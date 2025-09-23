import apiClient from '../apiClient';

// Tipos para las notificaciones
export interface PagoUrgente {
    id: number;
    tipo: 'TRANSPORTE' | 'VENTA_PRIVADA';
    codigo: string;
    monto: number | null;
    fechaLimite: Date | null;
    entidad: {
        id: number;
        nombre: string;
        ruc: string;
    };
    descripcion: string;
    notaPago: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Tipos para el dashboard de tesorería
export interface PagoPorEstado {
    id: number;
    tipo: 'TRANSPORTE' | 'VENTA_PRIVADA';
    codigo: string;
    cliente: string;
    transporteRazonSocial?: string;
    monto: number;
    fechaVencimiento: Date | null;
    estadoPago: 'URGENTE' | 'PENDIENTE';
    notaPago: string | null;
    fechaCreacion: Date;
    grt?: string;
    region?: string;
    provincia?: string;
    distrito?: string;
    descripcion: string;
    documentoPago?: string;
    documentoCotizacion?: string;
}

export interface EstadisticasPagosUrgentes {
    totalUrgentes: number;
    totalTransportes: number;
    totalVentas: number;
    montoTotal: number;
    montoTotalTransportes: number;
    montoTotalVentas: number;
}

export interface EstadisticasPorEstado {
    pendientes: {
        total: number;
        transportes: number;
        ventasPrivadas: number;
        montoTotal: number;
    };
    urgentes: {
        total: number;
        transportes: number;
        ventasPrivadas: number;
        montoTotal: number;
    };
}

export interface PagosUrgentesResponse {
    success: boolean;
    data: {
        transportes: PagoUrgente[];
        ventasPrivadas: PagoUrgente[];
    };
    estadisticas: EstadisticasPagosUrgentes;
    tiempoRespuesta?: number;
}

export interface PagosPorEstadoResponse {
    success: boolean;
    data: {
        pendientes: PagoPorEstado[];
        urgentes: PagoPorEstado[];
    };
    estadisticas: EstadisticasPorEstado;
}

// Servicio para obtener pagos urgentes
export const getPagosUrgentes = async (): Promise<PagosUrgentesResponse> => {
    try {
        const response = await apiClient.get('/tesoreria/pagos-urgentes');
        return response.data;
    } catch (error) {
        console.error('Error al obtener pagos urgentes:', error);
        throw error;
    }
};

// Servicio para obtener pagos pendientes
export const getPagosPendientes = async (): Promise<PagosUrgentesResponse> => {
    try {
        const response = await apiClient.get('/tesoreria/pagos-pendientes');
        return response.data;
    } catch (error) {
        console.error('Error al obtener pagos pendientes:', error);
        throw error;
    }
};

// Servicio para obtener pagos por estado usando el nuevo endpoint del backend
export const getPagosPorEstado = async (estado: 'URGENTE' | 'PENDIENTE'): Promise<PagosUrgentesResponse> => {
    try {
        const response = await apiClient.get(`/tesoreria/pagos-por-estado?estado=${estado}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener pagos por estado:', error);
        throw error;
    }
};

// Servicio para obtener todos los pagos por estado (usado por el dashboard para las pestañas tradicionales)
export const getTodosPagosPorEstado = async (): Promise<PagosPorEstadoResponse> => {
    try {
        // Llamar a ambos endpoints en paralelo
        const [urgentesResponse, pendientesResponse] = await Promise.all([
            getPagosUrgentes(),
            getPagosPendientes()
        ]);

        // Simular la respuesta esperada usando datos vacíos para las pestañas tradicionales
        return {
            success: true,
            data: {
                urgentes: [], // Las pestañas tradicionales mostrarán datos vacíos
                pendientes: [] // Solo las pestañas optimizadas tendrán datos reales
            },
            estadisticas: {
                urgentes: {
                    total: urgentesResponse.estadisticas?.totalUrgentes || 0,
                    transportes: urgentesResponse.estadisticas?.totalTransportes || 0,
                    ventasPrivadas: urgentesResponse.estadisticas?.totalVentas || 0,
                    montoTotal: urgentesResponse.estadisticas?.montoTotal || 0,
                },
                pendientes: {
                    total: pendientesResponse.estadisticas?.totalUrgentes || 0,
                    transportes: pendientesResponse.estadisticas?.totalTransportes || 0,
                    ventasPrivadas: pendientesResponse.estadisticas?.totalVentas || 0,
                    montoTotal: pendientesResponse.estadisticas?.montoTotal || 0,
                }
            }
        };
    } catch (error) {
        console.error('Error al obtener todos los pagos por estado:', error);
        throw error;
    }
};

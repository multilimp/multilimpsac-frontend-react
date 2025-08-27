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

// Servicio para obtener todos los pagos por estado
export const getPagosPorEstado = async (): Promise<PagosPorEstadoResponse> => {
    try {
        const response = await apiClient.get('/tesoreria/pagos-por-estado');
        return response.data;
    } catch (error) {
        console.error('Error al obtener pagos por estado:', error);
        throw error;
    }
};

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPagosUrgentes, getPagosPendientes } from '@/services/treasury/treasury.request';

// Interfaces para las respuestas de tesorería
interface TransportePago {
    id: number;
    codigoTransporte: string;
    montoFlete: number;
    createdAt: Date;
    updatedAt: Date;
    estadoPago: string;
    notaPago: string | null;
    transporte?: {
        id: number;
        razonSocial: string;
        ruc: string;
    };
    ordenProveedor: {
        id: number;
        codigoOp: string;
        proveedorId: number;
        ordenCompra: {
            cliente: {
                id: number;
                razonSocial: string;
                ruc: string;
            };
        };
    };
}

interface OrdenProveedorPago {
    id: number;
    codigoOp: string;
    proveedor?: {
        id: number;
        razonSocial: string;
        ruc: string;
    };
    ordenCompra: {
        id: number;
        codigoVenta: string;
        cliente: {
            id: number;
            razonSocial: string;
            ruc: string;
        };
    };
    montoTotal?: number;
    createdAt: Date;
    updatedAt: Date;
    estadoOp: string;
    notaPago: string | null;
}

interface PagosResponse {
    success: boolean;
    data: {
        transportes: TransportePago[];
        ordenesProveedor: OrdenProveedorPago[];
    };
    tiempoRespuesta: number;
};

export const useDashboardTesoreria = () => {
    const [loading, setLoading] = useState(false);
    const [pagosUrgentesData, setPagosUrgentesData] = useState<PagosResponse | null>(null);
    const [pagosPendientesData, setPagosPendientesData] = useState<PagosResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Cargar tanto pagos urgentes como pendientes
            const [urgentesResponse, pendientesResponse] = await Promise.all([
                getPagosUrgentes(),
                getPagosPendientes()
            ]);

            setPagosUrgentesData(urgentesResponse);
            setPagosPendientesData(pendientesResponse);
            setLastUpdate(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar dashboard');
            console.error('Error en dashboard tesorería:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para cargar pagos urgentes específicamente
    const fetchPagosUrgentes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getPagosUrgentes();
            setPagosUrgentesData(response);
            setLastUpdate(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar pagos urgentes');
            console.error('Error al cargar pagos urgentes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para cargar pagos pendientes específicamente
    const fetchPagosPendientes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getPagosPendientes();
            setPagosPendientesData(response);
            setLastUpdate(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar pagos pendientes');
            console.error('Error al cargar pagos pendientes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para refrescar manualmente
    const refresh = useCallback(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Función para refrescar pagos urgentes específicamente
    const refreshPagosUrgentes = useCallback(() => {
        fetchPagosUrgentes();
    }, [fetchPagosUrgentes]);

    // Función para refrescar pagos pendientes específicamente
    const refreshPagosPendientes = useCallback(() => {
        fetchPagosPendientes();
    }, [fetchPagosPendientes]);

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Auto-refresh cada 5 minutos (solo cuando no está en loading)
    useEffect(() => {
        if (loading) return;

        const interval = setInterval(() => {
            if (!loading) {
                fetchDashboard();
            }
        }, 5 * 60 * 1000); // 5 minutos

        return () => clearInterval(interval);
    }, [fetchDashboard, loading]);

    // Datos calculados para transportes urgentes
    const transportesUrgentes = useMemo((): TransportePago[] => {
        return pagosUrgentesData?.data.transportes || [];
    }, [pagosUrgentesData]);

    // Datos calculados para órdenes de proveedor urgentes
    const ordenesProveedorUrgentes = useMemo((): OrdenProveedorPago[] => {
        return pagosUrgentesData?.data.ordenesProveedor || [];
    }, [pagosUrgentesData]);

    // Datos calculados para transportes pendientes
    const transportesPendientes = useMemo((): TransportePago[] => {
        return pagosPendientesData?.data.transportes || [];
    }, [pagosPendientesData]);

    // Datos calculados para órdenes de proveedor pendientes
    const ordenesProveedorPendientes = useMemo((): OrdenProveedorPago[] => {
        return pagosPendientesData?.data.ordenesProveedor || [];
    }, [pagosPendientesData]);

    return {
        // Estados principales
        loading,
        pagosUrgentesData,
        pagosPendientesData,
        error,
        lastUpdate,

        // Acciones
        refresh,
        refreshPagosUrgentes,
        refreshPagosPendientes,

        // Datos procesados (memoizados)
        transportesPendientes,
        transportesUrgentes,
        ordenesProveedorUrgentes,
        ordenesProveedorPendientes
    };
};

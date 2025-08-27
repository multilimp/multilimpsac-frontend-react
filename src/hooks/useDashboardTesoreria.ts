/**
 * HOOK DASHBOARD TESORERÍA - GESTIÓN DE ESTADO CENTRALIZADA
 * =========================================================
 * 
 * 🎯 PROPÓSITO:
 * Hook personalizado para manejar todo el estado y lógica del dashboard de tesorería.
 * Centraliza la gestión de datos de pagos urgentes y pendientes con auto-refresh.
 * 
 * 📊 FUNCIONALIDADES:
 * - Fetch automático de datos al montar
 * - Auto-refresh cada 5 minutos
 * - Refresh manual con botón
 * - Filtrado inteligente por tipo de pago
 * - Cálculos de estadísticas en tiempo real
 * - Manejo de estados de carga y error
 * 
 * 🔄 FLUJO DE DATOS:
 * 1. fetchDashboard() → llama a getPagosPorEstado()
 * 2. Actualiza estado con respuesta del backend
 * 3. Funciones helper procesan y filtran datos
 * 4. Componente consume datos ya procesados
 * 
 * 📈 DATOS PROCESADOS:
 * - transportesPendientes: Fletes pendientes de pago
 * - transportesUrgentes: Fletes urgentes de pago  
 * - ventasPrivadasPendientes: Ventas privadas pendientes
 * - ventasPrivadasUrgentes: Ventas privadas urgentes
 * - estadisticas: Totales y montos agregados
 * 
 * ⚡ OPTIMIZACIONES:
 * - useCallback para evitar re-renders innecesarios
 * - Auto-cleanup de intervalos
 * - Manejo inteligente de errores
 * - Estados booleanos calculados para UI
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPagosPorEstado, PagosPorEstadoResponse, PagoPorEstado } from '@/services/notificaciones/notificaciones.request';

export const useDashboardTesoreria = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PagosPorEstadoResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Función para cargar los datos
    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getPagosPorEstado();
            setData(response);
            setLastUpdate(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar dashboard');
            console.error('Error en dashboard tesorería:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para refrescar manualmente
    const refresh = useCallback(() => {
        fetchDashboard();
    }, [fetchDashboard]);

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

    // Memoización de datos filtrados para evitar recálculos innecesarios
    const transportesPendientes = useMemo((): PagoPorEstado[] => {
        return data?.data.pendientes.filter(pago => pago.tipo === 'TRANSPORTE') || [];
    }, [data]);

    const transportesUrgentes = useMemo((): PagoPorEstado[] => {
        return data?.data.urgentes.filter(pago => pago.tipo === 'TRANSPORTE') || [];
    }, [data]);

    const ventasPrivadasPendientes = useMemo((): PagoPorEstado[] => {
        return data?.data.pendientes.filter(pago => pago.tipo === 'VENTA_PRIVADA') || [];
    }, [data]);

    const ventasPrivadasUrgentes = useMemo((): PagoPorEstado[] => {
        return data?.data.urgentes.filter(pago => pago.tipo === 'VENTA_PRIVADA') || [];
    }, [data]);

    // Memoización de estadísticas calculadas
    const estadisticasCalculadas = useMemo(() => {
        const totalPagos = (data?.estadisticas.pendientes.total || 0) + (data?.estadisticas.urgentes.total || 0);
        const montoTotal = (data?.estadisticas.pendientes.montoTotal || 0) + (data?.estadisticas.urgentes.montoTotal || 0);

        return {
            totalPagos,
            montoTotal,
            hasData: !!data,
            hasPendientes: (data?.estadisticas.pendientes.total || 0) > 0,
            hasUrgentes: (data?.estadisticas.urgentes.total || 0) > 0,
        };
    }, [data]);

    return {
        // Estados principales
        loading,
        data,
        error,
        lastUpdate,

        // Acciones
        refresh,

        // Datos procesados (memoizados)
        transportesPendientes,
        transportesUrgentes,
        ventasPrivadasPendientes,
        ventasPrivadasUrgentes,

        // Estadísticas (memoizadas)
        estadisticas: data?.estadisticas,
        totalPagos: estadisticasCalculadas.totalPagos,
        montoTotal: estadisticasCalculadas.montoTotal,

        // Estados booleanos útiles (memoizados)
        hasData: estadisticasCalculadas.hasData,
        hasPendientes: estadisticasCalculadas.hasPendientes,
        hasUrgentes: estadisticasCalculadas.hasUrgentes,
    };
};

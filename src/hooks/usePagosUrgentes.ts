import { useState, useEffect, useCallback } from 'react';
import { getPagosUrgentes, PagosUrgentesResponse } from '@/services/notificaciones/notificaciones.request';

interface UsePagosUrgentesReturn {
    data: PagosUrgentesResponse | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    totalUrgentes: number;
    montoTotal: number;
}

export const usePagosUrgentes = (autoRefresh = true, intervalMs = 5 * 60 * 1000): UsePagosUrgentesReturn => {
    const [data, setData] = useState<PagosUrgentesResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPagosUrgentes();
            setData(response);
        } catch (err) {
            setError('Error al cargar pagos urgentes');
            console.error('Error loading pagos urgentes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();

        if (autoRefresh && intervalMs > 0) {
            const interval = setInterval(refresh, intervalMs);
            return () => clearInterval(interval);
        }
    }, [refresh, autoRefresh, intervalMs]);

    return {
        data,
        loading,
        error,
        refresh,
        totalUrgentes: data?.estadisticas.totalUrgentes || 0,
        montoTotal: data?.estadisticas.montoTotal || 0,
    };
};

// Hook simplificado solo para obtener el contador
export const useContadorPagosUrgentes = (): number => {
    const { totalUrgentes } = usePagosUrgentes(true, 2 * 60 * 1000); // Refresh cada 2 minutos
    return totalUrgentes;
};

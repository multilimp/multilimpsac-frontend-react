import { PagoProveedorTransporte, HistorialPagos } from '@/types/pagos.types';
import apiClient from '../apiClient';

const API_BASE = '/saldos';

// Crear un nuevo pago
export const createPago = async (pago: Omit<PagoProveedorTransporte, 'id' | 'createdAt' | 'updatedAt'>): Promise<PagoProveedorTransporte> => {
    const endpoint = pago.tipoEntidad === 'PROVEEDOR'
        ? `${API_BASE}/providers/${pago.proveedorTransporteId}/saldos`
        : `${API_BASE}/transports/${pago.proveedorTransporteId}/saldos`;

    // Mapear el estado del frontend al tipoMovimiento del backend
    const tipoMovimiento = pago.estado === 'A_FAVOR' ? 'A_FAVOR' : 'DEBE';

    const response = await apiClient.post(endpoint, {
        fecha: pago.fechaPago,
        banco: pago.banco,
        descripcion: pago.descripcion,
        tipoMovimiento,
        monto: pago.total
    });

    return transformSaldoToPago(response.data, pago.tipoEntidad);
};

// Obtener historial de pagos por entidad
export const getHistorialPagos = async (entidadId: number, tipoEntidad: 'PROVEEDOR' | 'TRANSPORTE'): Promise<HistorialPagos> => {
    const endpoint = tipoEntidad === 'PROVEEDOR'
        ? `${API_BASE}/providers/${entidadId}/financial-data`
        : `${API_BASE}/transports/${entidadId}/financial-data`;

    const response = await apiClient.get(endpoint);
    return transformFinancialDataToHistorial(response.data, tipoEntidad);
};

// Actualizar un pago
export const updatePago = async (id: number, pago: Partial<PagoProveedorTransporte>): Promise<PagoProveedorTransporte> => {
    // Mapear el estado del frontend al tipoMovimiento del backend
    const tipoMovimiento = pago.estado === 'A_FAVOR' ? 'A_FAVOR' : 'DEBE';

    const response = await apiClient.put(`${API_BASE}/saldos/${id}`, {
        fecha: pago.fechaPago,
        banco: pago.banco,
        descripcion: pago.descripcion,
        tipoMovimiento,
        monto: pago.total
    });

    return transformSaldoToPago(response.data, pago.tipoEntidad!);
};

// Eliminar un pago
export const deletePago = async (id: number): Promise<void> => {
    await apiClient.delete(`${API_BASE}/saldos/${id}`);
};

// Funciones auxiliares para transformar datos
const transformSaldoToPago = (response: any, tipoEntidad: string): PagoProveedorTransporte => {
    // El backend puede devolver la data directamente o envuelta en { data: ... }
    const saldo = response.data || response;

    return {
        id: saldo.id,
        proveedorTransporteId: saldo.proveedorId || saldo.transporteId,
        tipoEntidad: tipoEntidad as 'PROVEEDOR' | 'TRANSPORTE',
        fechaPago: saldo.fecha,
        banco: saldo.banco,
        descripcion: saldo.descripcion,
        estado: saldo.tipoMovimiento,
        total: Number(saldo.monto),
        saldoPendiente: Number(saldo.saldoPendiente || 0),
        createdAt: saldo.createdAt,
        updatedAt: saldo.updatedAt
    };
};

const transformFinancialDataToHistorial = (response: any, tipoEntidad: string): HistorialPagos => {
    // El backend puede devolver la data directamente o envuelta en { data: ... }
    const data = response.data || response;
    const saldos = data.saldos || [];
    const saldoTotal = data.saldoTotal || 0;

    const pagos: PagoProveedorTransporte[] = saldos.map((saldo: any) =>
        transformSaldoToPago(saldo, tipoEntidad)
    );

    // Calcular totales
    const totalAFavor = saldos
        .filter((s: any) => s.tipoMovimiento === 'A_FAVOR')
        .reduce((sum: number, s: any) => sum + Number(s.monto), 0);

    const totalCobrado = saldos
        .filter((s: any) => s.tipoMovimiento === 'DEBE')
        .reduce((sum: number, s: any) => sum + Number(s.monto), 0);

    return {
        pagos,
        saldoTotalPendiente: saldoTotal,
        totalAFavor,
        totalCobrado
    };
};

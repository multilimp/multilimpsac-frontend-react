import apiClient from '../apiClient';
import { SaldoData, CuentaBancariaData, EntidadFinancieraData, SaldoResumen } from './saldos.service';

// Obtener información financiera de un proveedor
export const getProviderFinancialData = async (providerId: number): Promise<EntidadFinancieraData> => {
    try {
        const response = await apiClient.get(`/saldos/providers/${providerId}/financial-data`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener datos financieros del proveedor');
    }
};

// Obtener información financiera de un transporte
export const getTransportFinancialData = async (transportId: number): Promise<EntidadFinancieraData> => {
    try {
        const response = await apiClient.get(`/saldos/transports/${transportId}/financial-data`);
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener datos financieros del transporte');
    }
};

// Crear saldo para proveedor
export const createProviderSaldo = async (providerId: number, saldoData: Omit<SaldoData, 'id' | 'fecha' | 'activo'>) => {
    try {
        const response = await apiClient.post(`/saldos/providers/${providerId}/saldos`, saldoData);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear saldo del proveedor');
    }
};

// Crear saldo para transporte
export const createTransportSaldo = async (transportId: number, saldoData: Omit<SaldoData, 'id' | 'fecha' | 'activo'>) => {
    try {
        const response = await apiClient.post(`/saldos/transports/${transportId}/saldos`, saldoData);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear saldo del transporte');
    }
};

// Actualizar saldo
export const updateSaldo = async (saldoId: number, saldoData: Partial<SaldoData>) => {
    try {
        const response = await apiClient.put(`/saldos/saldos/${saldoId}`, saldoData);
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar saldo');
    }
};

// Eliminar saldo
export const deleteSaldo = async (saldoId: number) => {
    try {
        const response = await apiClient.delete(`/saldos/saldos/${saldoId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error al eliminar saldo');
    }
};

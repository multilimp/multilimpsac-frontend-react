import { BankAccount, CuentaBancariaTipo } from '@/types/bankAccount.types';
import apiClient from '../apiClient';

const API_BASE = '/bank-accounts';

// Obtener cuentas bancarias por tipo y referenciaId
export const getBankAccountsByEntity = async (
    tipo: CuentaBancariaTipo,
    referenciaId: number
): Promise<BankAccount[]> => {
    const response = await apiClient.get(`${API_BASE}?tipo=${tipo}&referenciaId=${referenciaId}`);
    return response.data;
};

// Obtener todas las cuentas bancarias activas de una entidad
export const getActiveBankAccountsByEntity = async (
    tipo: CuentaBancariaTipo,
    referenciaId: number
): Promise<BankAccount[]> => {
    const accounts = await getBankAccountsByEntity(tipo, referenciaId);
    return accounts.filter(account => account.activa);
};
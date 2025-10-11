export type CuentaBancariaTipo = 'CLIENTE' | 'PROVEEDOR' | 'TRANSPORTE' | 'EMPRESA';

export type Moneda = 'SOLES' | 'DOLARES';

export interface BankAccount {
    id: number;
    referenciaId: number;
    tipoCuenta: CuentaBancariaTipo;
    banco: string;
    numeroCuenta: string;
    numeroCci?: string;
    moneda: Moneda;
    activa: boolean;
    clienteId?: number;
    proveedorId?: number;
    transporteId?: number;
    empresaId?: number;
    createdAt: string;
    updatedAt: string;
}
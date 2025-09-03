export interface SaldoData {
    id: number;
    tipoMovimiento: 'A_FAVOR' | 'DEBE';
    monto: number;
    descripcion?: string;
    fecha: string;
    activo: boolean;
}

export interface CuentaBancariaData {
    id: number;
    banco: string;
    numeroCuenta: string;
    numeroCci?: string;
    moneda: 'SOLES' | 'DOLARES';
    tipoCuenta: 'PROVEEDOR' | 'TRANSPORTE';
    activa: boolean;
}

export interface SaldoResumen {
    saldoFavor: number;
    saldoDeuda: number;
    saldoNeto: number;
    tipoSaldo: 'A_FAVOR' | 'DEBE' | 'NEUTRO';
}

export interface EntidadFinancieraData {
    saldos: SaldoData[];
    cuentasBancarias: CuentaBancariaData[];
    resumenSaldo: SaldoResumen;
}

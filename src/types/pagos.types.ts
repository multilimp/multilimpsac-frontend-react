export interface PagoProveedorTransporte {
    id?: number;
    proveedorTransporteId: number;
    tipoEntidad: 'PROVEEDOR' | 'TRANSPORTE';
    fechaPago: string;
    banco: string;
    descripcion: string;
    estado: 'A_FAVOR' | 'COBRADO';
    total: number;
    saldoPendiente: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface HistorialPagos {
    pagos: PagoProveedorTransporte[];
    saldoTotalPendiente: number;
    totalAFavor: number;
    totalCobrado: number;
}

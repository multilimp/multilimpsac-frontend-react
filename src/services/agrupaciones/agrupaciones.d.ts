export interface AgrupacionOrdenCompraProps {
    id: number;
    codigoGrupo: string;
    descripcion?: string;
    fecha: string;
    createdAt: string;
    updatedAt: string;
    ordenesCompra: OrdenCompraAgrupadaProps[];
}

export interface OrdenCompraAgrupadaProps {
    id: number;
    agrupacionOrdenCompraId: number;
    ordenCompraId: number;
    createdAt: string;
    updatedAt: string;
    ordenCompra: {
        id: number;
        codigoVenta: string;
        montoVenta: string;
        fechaEmision: string;
        cliente: {
            razonSocial: string;
            ruc: string;
        };
    };
}

export interface CreateAgrupacionProps {
    codigoGrupo: string;
    descripcion?: string;
    fecha?: string;
    ordenesCompraIds?: number[];
}

export interface AddOrdenCompraToAgrupacionProps {
    agrupacionId: number;
    ordenCompraId: number;
}
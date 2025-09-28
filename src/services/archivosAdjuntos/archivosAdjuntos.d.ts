// src/services/archivosAdjuntos/archivosAdjuntos.d.ts
export interface ArchivoAdjunto {
    id: number;
    ordenCompraId: number;
    nombre: string;
    url: string;
    tipo: string;
    tamano: number;
    descripcion?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateArchivoAdjuntoRequest {
    ordenCompraId: number;
    nombre: string;
    url: string;
    tipo: string;
    tamano: number;
    descripcion?: string;
}

export interface UpdateArchivoAdjuntoRequest {
    nombre?: string;
    descripcion?: string;
}
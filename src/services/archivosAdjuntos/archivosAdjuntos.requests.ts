// src/services/archivosAdjuntos/archivosAdjuntos.requests.ts
import apiClient from '../apiClient';
import {
    ArchivoAdjunto,
    CreateArchivoAdjuntoRequest,
    UpdateArchivoAdjuntoRequest
} from './archivosAdjuntos.d';

/**
 * Obtiene todos los archivos adjuntos de una orden de compra
 */
export const getArchivosAdjuntosByOrdenCompra = async (ordenCompraId: number): Promise<ArchivoAdjunto[]> => {
    try {
        const response = await apiClient.get(`/archivos-adjuntos/orden-compra/${ordenCompraId}`);
        return response.data.data || [];
    } catch (error) {
        console.error('Error al obtener archivos adjuntos:', error);
        throw error;
    }
};

/**
 * Obtiene un archivo adjunto por ID
 */
export const getArchivoAdjuntoById = async (id: number): Promise<ArchivoAdjunto> => {
    try {
        const response = await apiClient.get(`/archivos-adjuntos/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener archivo adjunto:', error);
        throw error;
    }
};

/**
 * Crea un nuevo archivo adjunto
 */
export const createArchivoAdjunto = async (data: CreateArchivoAdjuntoRequest): Promise<ArchivoAdjunto> => {
    try {
        const response = await apiClient.post('/archivos-adjuntos', data);
        return response.data.data;
    } catch (error) {
        console.error('Error al crear archivo adjunto:', error);
        throw error;
    }
};

/**
 * Actualiza un archivo adjunto
 */
export const updateArchivoAdjunto = async (id: number, data: UpdateArchivoAdjuntoRequest): Promise<ArchivoAdjunto> => {
    try {
        const response = await apiClient.put(`/archivos-adjuntos/${id}`, data);
        return response.data.data;
    } catch (error) {
        console.error('Error al actualizar archivo adjunto:', error);
        throw error;
    }
};

/**
 * Elimina un archivo adjunto
 */
export const deleteArchivoAdjunto = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/archivos-adjuntos/${id}`);
    } catch (error) {
        console.error('Error al eliminar archivo adjunto:', error);
        throw error;
    }
};
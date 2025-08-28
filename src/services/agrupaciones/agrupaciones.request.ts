import apiClient from '../apiClient';
import {
    AgrupacionOrdenCompraProps,
    CreateAgrupacionProps,
    AddOrdenCompraToAgrupacionProps
} from './agrupaciones.d';

export const getAgrupaciones = async (): Promise<AgrupacionOrdenCompraProps[]> => {
    const response = await apiClient.get('/agrupaciones-oc');
    return response.data;
};

export const getAgrupacionById = async (id: number): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.get(`/agrupaciones-oc/${id}`);
    return response.data;
};

export const createAgrupacion = async (data: CreateAgrupacionProps): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.post('/agrupaciones-oc', data);
    return response.data;
};

export const updateAgrupacion = async (id: number, data: Partial<CreateAgrupacionProps>): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.put(`/agrupaciones-oc/${id}`, data);
    return response.data;
};

export const deleteAgrupacion = async (id: number): Promise<void> => {
    await apiClient.delete(`/agrupaciones-oc/${id}`);
};

export const addOrdenCompraToAgrupacion = async (data: AddOrdenCompraToAgrupacionProps): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.post(`/agrupaciones-oc/${data.agrupacionId}/ordenes-compra`, {
        ordenCompraId: data.ordenCompraId
    });
    return response.data;
};

export const removeOrdenCompraFromAgrupacion = async (agrupacionId: number, ordenCompraId: number): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.delete(`/agrupaciones-oc/${agrupacionId}/ordenes-compra/${ordenCompraId}`);
    return response.data;
};

// ✅ NUEVO: Obtener agrupación de una OC específica
export const getAgrupacionByOrdenCompra = async (ordenCompraId: number): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.get(`/agrupaciones-oc/by-orden-compra/${ordenCompraId}`);
    return response.data;
};
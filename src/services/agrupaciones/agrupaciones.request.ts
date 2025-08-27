import apiClient from '../apiClient';
import {
    AgrupacionOrdenCompraProps,
    CreateAgrupacionProps,
    AddOrdenCompraToAgrupacionProps
} from './agrupaciones.d';

export const getAgrupaciones = async (): Promise<AgrupacionOrdenCompraProps[]> => {
    const response = await apiClient.get('/agrupaciones');
    return response.data;
};

export const getAgrupacionById = async (id: number): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.get(`/agrupaciones/${id}`);
    return response.data;
};

export const createAgrupacion = async (data: CreateAgrupacionProps): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.post('/agrupaciones', data);
    return response.data;
};

export const updateAgrupacion = async (id: number, data: Partial<CreateAgrupacionProps>): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.put(`/agrupaciones/${id}`, data);
    return response.data;
};

export const deleteAgrupacion = async (id: number): Promise<void> => {
    await apiClient.delete(`/agrupaciones/${id}`);
};

export const addOrdenCompraToAgrupacion = async (data: AddOrdenCompraToAgrupacionProps): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.post(`/agrupaciones/${data.agrupacionId}/add-orden-compra`, {
        ordenCompraId: data.ordenCompraId
    });
    return response.data;
};

export const removeOrdenCompraFromAgrupacion = async (agrupacionId: number, ordenCompraId: number): Promise<AgrupacionOrdenCompraProps> => {
    const response = await apiClient.post(`/agrupaciones/${agrupacionId}/remove-orden-compra`, {
        ordenCompraId
    });
    return response.data;
};
import apiClient from '../apiClient';
import {
    Almacen,
    CreateAlmacenData,
    UpdateAlmacenData,
    Producto,
    CreateProductoData,
    UpdateProductoData,
    StockProducto,
    CreateStockData,
    UpdateStockData,
    StockWithDetails,
    MovimientoStock
} from '@/types/almacen.types';

const BASE_URL = '/almacenes';

// ============ SERVICIOS DE ALMACENES ============
export const getAlmacenes = async (): Promise<Almacen[]> => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

export const getAlmacenById = async (id: number): Promise<Almacen> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createAlmacen = async (data: CreateAlmacenData): Promise<Almacen> => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
};

export const updateAlmacen = async (id: number, data: UpdateAlmacenData): Promise<Almacen> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
};

export const deleteAlmacen = async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};

// ============ SERVICIOS DE PRODUCTOS ============
export const getProductos = async (): Promise<Producto[]> => {
    const response = await apiClient.get(`${BASE_URL}/productos/list`);
    return response.data;
};

export const getProductoById = async (id: number): Promise<Producto> => {
    const response = await apiClient.get(`${BASE_URL}/productos/${id}`);
    return response.data;
};

export const createProducto = async (data: CreateProductoData): Promise<Producto> => {
    const response = await apiClient.post(`${BASE_URL}/productos`, data);
    return response.data;
};

export const updateProducto = async (id: number, data: UpdateProductoData): Promise<Producto> => {
    const response = await apiClient.put(`${BASE_URL}/productos/${id}`, data);
    return response.data;
};

export const deleteProducto = async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/productos/${id}`);
};

// ============ SERVICIOS DE STOCK ============
export const getStock = async (): Promise<StockWithDetails[]> => {
    const response = await apiClient.get(`${BASE_URL}/stock/list`);
    return response.data;
};

export const getStockByAlmacen = async (almacenId: number): Promise<StockWithDetails[]> => {
    const response = await apiClient.get(`${BASE_URL}/stock/almacen/${almacenId}`);
    return response.data;
};

export const getStockByProducto = async (productoId: number): Promise<StockWithDetails[]> => {
    const response = await apiClient.get(`${BASE_URL}/stock/producto/${productoId}`);
    return response.data;
};

export const createOrUpdateStock = async (data: CreateStockData): Promise<StockWithDetails> => {
    const response = await apiClient.post(`${BASE_URL}/stock`, data);
    return response.data;
};

export const updateStock = async (
    productoId: number,
    almacenId: number,
    data: UpdateStockData
): Promise<StockWithDetails> => {
    const response = await apiClient.put(`${BASE_URL}/stock/${productoId}/${almacenId}`, data);
    return response.data;
};

export const deleteStock = async (productoId: number, almacenId: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/stock/${productoId}/${almacenId}`);
};

export const getMovimientosByStock = async (
    productoId: number,
    almacenId: number
): Promise<MovimientoStock[]> => {
    const response = await apiClient.get(`${BASE_URL}/stock/movimientos/${productoId}/${almacenId}`);
    return Array.isArray(response.data) ? response.data : [];
};

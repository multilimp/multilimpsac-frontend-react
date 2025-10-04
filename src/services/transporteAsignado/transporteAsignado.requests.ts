import apiClient from '../apiClient';

export interface TransporteAsignadoProps {
    id: number;
    codigoTransporte: string;
    transporteId: number;
    ordenProveedorId: number;
    contactoTransporteId: number;
    tipoDestino: string;
    region: string;
    provincia: string;
    distrito: string;
    direccion: string;
    notaTransporte: string;
    cotizacionTransporte: string;
    notaPago: string;
    estadoPago: string | null;
    montoFlete: number | null;
    grt: string | null;
    almacenId: number | null;
    createdAt: string;
    updatedAt: string;
    transporte: any;
    contactoTransporte: any;
    almacen?: any;
    pagos: any[];
}

export const getTransportesAsignados = async (ordenProveedorId: number): Promise<TransporteAsignadoProps[]> => {
    try {
        const response = await apiClient.get(`/transporte-asignado?ordenProveedorId=${ordenProveedorId}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error fetching transportes asignados:', error);
        return [];
    }
};

export const createTransporteAsignado = async (data: Record<string, any>): Promise<TransporteAsignadoProps> => {
    const response = await apiClient.post('/transporte-asignado', data);
    return response.data;
};

export const updateTransporteAsignado = async (id: number, data: Record<string, any>): Promise<TransporteAsignadoProps> => {
    const response = await apiClient.put(`/transporte-asignado/${id}`, data);
    return response.data;
};

export const deleteTransporteAsignado = async (id: number): Promise<void> => {
    await apiClient.delete(`/transporte-asignado/${id}`);
};
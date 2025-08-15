import apiClient from "../apiClient";

export type EntityType = 'ordenCompraPrivada' | 'ordenProveedor' | 'transporteAsignado';

export interface PaymentData {
  fechaPago?: Date | null;
  bancoPago?: string | null;
  descripcionPago?: string | null;
  archivoPago?: string | File | null;
  montoPago?: number | null;
  estadoPago?: boolean;
}

export interface UpdatePaymentsRequest {
  entityType: EntityType;
  entityId: number;
  payments: PaymentData[];
  tipoPago?: string;
  notaPago?: string;
}

export interface UpdatePaymentsResponse {
  entityType: EntityType;
  entityId: number;
  payments: any[];
  tipoPago?: string;
  notaPago?: string;
}

export const updatePayments = async (data: UpdatePaymentsRequest): Promise<UpdatePaymentsResponse> => {
  const response = await apiClient.patch('/payments/update', data);
  return response.data;
};

export const getPaymentsByEntity = async (entityType: EntityType, entityId: number) => {
  const response = await apiClient.get(`/payments/${entityType}/${entityId}`);
  return response.data;
};

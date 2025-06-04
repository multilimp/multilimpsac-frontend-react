import { useState, useEffect } from 'react';
import { PurchaseOrderData } from '@/types/purchaseOrder';

// Mock data - en producción esto vendría de una API
const mockPurchaseOrders: Record<string, PurchaseOrderData> = {
  'OCGRU660': {
    codigo: 'OCGRU660',
    fecha: '20/10/2025',
    fechaMaxima: 'Jan 9, 2014',
    opImporteTotal: 'S/ 20580.34',
    ocImporteTotal: 'S/ 20580.34'
  },
  'OCGRU661': {
    codigo: 'OCGRU661',
    fecha: '21/10/2025',
    fechaMaxima: 'Jan 15, 2014',
    opImporteTotal: 'S/ 18750.00',
    ocImporteTotal: 'S/ 18750.00'
  },
  'OCGRU662': {
    codigo: 'OCGRU662',
    fecha: '22/10/2025',
    fechaMaxima: 'Jan 20, 2014',
    opImporteTotal: 'S/ 25000.00',
    ocImporteTotal: 'S/ 25000.00'
  }
};

interface UsePurchaseOrderReturn {
  purchaseOrder: PurchaseOrderData | null;
  loading: boolean;
  error: string | null;
  fetchPurchaseOrder: (codigo: string) => Promise<void>;
  getAllPurchaseOrders: () => PurchaseOrderData[];
}

export const usePurchaseOrder = (codigo?: string): UsePurchaseOrderReturn => {
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrder = async (orderCode: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const order = mockPurchaseOrders[orderCode];
      if (order) {
        setPurchaseOrder(order);
      } else {
        setError(`Orden de compra ${orderCode} no encontrada`);
      }
    } catch (err) {
      setError('Error al cargar la orden de compra');
    } finally {
      setLoading(false);
    }
  };

  const getAllPurchaseOrders = (): PurchaseOrderData[] => {
    return Object.values(mockPurchaseOrders);
  };

  useEffect(() => {
    if (codigo) {
      fetchPurchaseOrder(codigo);
    }
  }, [codigo]);

  return {
    purchaseOrder,
    loading,
    error,
    fetchPurchaseOrder,
    getAllPurchaseOrders
  };
};

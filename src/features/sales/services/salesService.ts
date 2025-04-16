
import { supabase } from '@/integrations/supabase/client';
import { PurchaseOrder } from '@/features/purchaseOrder/models/purchaseOrder';

export const fetchSales = async (): Promise<PurchaseOrder[]> => {
  try {
    // For mock data during development
    const mockData: PurchaseOrder[] = [
      {
        id: '1',
        orderNumber: 'V-2023-001',
        clientId: '1',
        clientName: 'Hospital Nacional Dos de Mayo',
        date: '2023-05-15',
        total: 12500.00,
        status: 'completed',
        type: 'public',
        documents: {
          oce: 'OCE-2023-001',
          ocf: 'OCF-2023-001'
        },
        items: [
          {
            id: '101',
            productId: 'P001',
            productName: 'Detergente Industrial',
            description: 'Detergente Industrial x 20kg',
            quantity: 10,
            unitPrice: 125.00,
            total: 1250.00
          }
        ],
        createdAt: '2023-05-10T10:00:00Z',
        updatedAt: '2023-05-15T14:30:00Z'
      },
      {
        id: '2',
        orderNumber: 'V-2023-002',
        clientId: '2',
        clientName: 'Clínica Internacional',
        date: '2023-06-20',
        total: 8750.50,
        status: 'pending',
        type: 'private',
        documents: {},
        items: [
          {
            id: '201',
            productId: 'P002',
            productName: 'Desinfectante Hospitalario',
            description: 'Desinfectante Hospitalario x 5L',
            quantity: 15,
            unitPrice: 583.37,
            total: 8750.50
          }
        ],
        createdAt: '2023-06-15T09:30:00Z',
        updatedAt: '2023-06-20T11:45:00Z'
      },
      {
        id: '3',
        orderNumber: 'V-2023-003',
        clientId: '3',
        clientName: 'Ministerio de Salud',
        date: '2023-07-05',
        total: 22800.00,
        status: 'partial',
        type: 'public',
        documents: {
          oce: 'OCE-2023-003'
        },
        items: [
          {
            id: '301',
            productId: 'P003',
            productName: 'Kit de Limpieza Industrial',
            description: 'Kit completo para limpieza institucional',
            quantity: 20,
            unitPrice: 1140.00,
            total: 22800.00
          }
        ],
        createdAt: '2023-07-01T08:15:00Z',
        updatedAt: '2023-07-05T16:20:00Z'
      }
    ];

    // Uncomment this to use real data from Supabase
    /*
    const { data, error } = await supabase
      .from('ordenes_compra')
      .select(`
        id,
        codigo_venta as orderNumber,
        cliente_id as clientId,
        clientes:cliente_id (razon_social),
        fecha_emision as date,
        monto_venta as total,
        etapa_actual as status,
        venta_privada,
        documento_oce,
        documento_ocf,
        created_at as createdAt,
        updated_at as updatedAt
      `)
      .eq('estado_activo', true);

    if (error) {
      console.error('Error fetching sales:', error);
      throw new Error(error.message);
    }

    return data.map((item: any) => ({
      id: item.id,
      orderNumber: item.orderNumber,
      clientId: item.clientId,
      clientName: item.clientes?.razon_social || 'Cliente no identificado',
      date: item.date,
      total: item.total || 0,
      status: mapStatus(item.status),
      type: item.venta_privada ? 'private' : 'public',
      documents: {
        oce: item.documento_oce,
        ocf: item.documento_ocf
      },
      items: [], // These would need to be fetched separately
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    */

    return mockData;
  } catch (error) {
    console.error('Error in fetchSales:', error);
    throw error;
  }
};

// Helper function to map database status to our model status
const mapStatus = (dbStatus: string): PurchaseOrder['status'] => {
  const statusMap: Record<string, PurchaseOrder['status']> = {
    'creacion': 'pending',
    'entregado_parcial': 'partial',
    'entregado_completo': 'completed',
    'anulado': 'cancelled',
    // Add more mappings as needed
  };
  
  return statusMap[dbStatus] || 'pending';
};

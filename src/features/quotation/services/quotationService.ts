
import { supabase } from "@/integrations/supabase/client";
import { Quotation } from "@/data/models/quotation";

// Fetch all quotations
export const fetchQuotations = async (): Promise<Quotation[]> => {
  // In a real application with Supabase, you would do:
  // const { data, error } = await supabase.from('cotizaciones').select('*');
  // if (error) throw new Error(error.message);
  // return data;
  
  // For now, use mock data from the existing service
  const { data, error } = await supabase
    .from('cotizaciones')
    .select(`
      id,
      codigo_cotizacion as number,
      cliente_id as clientId,
      clientes:cliente_id (razon_social),
      fecha_cotizacion as date,
      fecha_entrega as expiryDate,
      monto_total as total,
      estado as status,
      created_at as createdAt,
      updated_at as updatedAt
    `)
    .order('fecha_cotizacion', { ascending: false });
    
  if (error) {
    console.error("Error fetching quotations:", error);
    // Fallback to mock data if there's an error
    return getMockQuotations();
  }
  
  // Transform the data to match the Quotation interface
  return data.map(item => ({
    id: item.id,
    number: item.number,
    clientId: item.clientId,
    clientName: item.clientes?.razon_social || "Cliente sin nombre",
    date: item.date,
    expiryDate: item.expiryDate,
    total: item.total || 0,
    status: mapStatus(item.status),
    items: [],
    createdBy: "system",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  }));
};

// Map status from database to our application status
function mapStatus(status: string | null): Quotation['status'] {
  switch (status) {
    case 'aprobada': return 'approved';
    case 'rechazada': return 'rejected';
    case 'enviada': return 'sent';
    case 'vencida': return 'expired';
    default: return 'draft';
  }
}

// Get a single quotation by ID
export const fetchQuotationById = async (id: string): Promise<Quotation> => {
  // Implement real Supabase fetch here
  // For now, return mock data
  const mockQuotation = getMockQuotations().find(q => q.id === id);
  if (!mockQuotation) {
    throw new Error('Quotation not found');
  }
  return mockQuotation;
};

// Create a new quotation
export const createQuotation = async (quotation: Omit<Quotation, 'id'>): Promise<Quotation> => {
  // Implement real Supabase insert here
  // For now, return mock data
  const newQuotation = {
    ...quotation,
    id: `new-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newQuotation;
};

// Update quotation status
export const updateQuotationStatus = async (id: string, status: Quotation['status']): Promise<Quotation> => {
  // Implement real Supabase update here
  // For now, update mock data
  const mockQuotations = getMockQuotations();
  const quotation = mockQuotations.find(q => q.id === id);
  if (!quotation) {
    throw new Error('Quotation not found');
  }
  
  const updatedQuotation = { ...quotation, status, updatedAt: new Date().toISOString() };
  return updatedQuotation;
};

// Delete a quotation
export const deleteQuotation = async (id: string): Promise<void> => {
  // Implement real Supabase delete here
  // For now, just return a resolved promise
  return Promise.resolve();
};

// Mock data for development
function getMockQuotations(): Quotation[] {
  return [
    {
      id: "1",
      number: "COT-2023-001",
      clientId: "1",
      clientName: "Empresa ABC",
      date: "2023-09-01",
      expiryDate: "2023-10-01",
      total: 5000,
      status: "sent",
      items: [
        {
          id: "item-1",
          productId: "prod-1",
          productName: "Producto 1",
          description: "Descripción del producto 1",
          quantity: 2,
          unitPrice: 1500,
          total: 3000
        },
        {
          id: "item-2",
          productId: "prod-2",
          productName: "Producto 2",
          description: "Descripción del producto 2",
          quantity: 1,
          unitPrice: 2000,
          total: 2000
        }
      ],
      createdBy: "user-1",
      createdAt: "2023-09-01T10:00:00Z",
      updatedAt: "2023-09-01T10:00:00Z"
    },
    {
      id: "2",
      number: "COT-2023-002",
      clientId: "2",
      clientName: "Empresa XYZ",
      date: "2023-09-15",
      expiryDate: "2023-10-15",
      total: 8500,
      status: "approved",
      items: [
        {
          id: "item-3",
          productId: "prod-3",
          productName: "Producto 3",
          description: "Descripción del producto 3",
          quantity: 3,
          unitPrice: 1500,
          total: 4500
        },
        {
          id: "item-4",
          productId: "prod-4",
          productName: "Producto 4",
          description: "Descripción del producto 4",
          quantity: 2,
          unitPrice: 2000,
          total: 4000
        }
      ],
      createdBy: "user-1",
      createdAt: "2023-09-15T10:00:00Z",
      updatedAt: "2023-09-15T10:00:00Z"
    }
  ];
}

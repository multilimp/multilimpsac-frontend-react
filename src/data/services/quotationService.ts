
import { supabase } from "@/integrations/supabase/client";
import { Quotation } from "@/data/models/quotation";

// Mock data for development
const mockQuotations: Quotation[] = [
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
    updatedAt: "2023-09-01T10:00:00Z",
    status: "active"
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
    updatedAt: "2023-09-15T10:00:00Z",
    status: "active"
  }
];

// Service functions
export const fetchQuotations = async (): Promise<Quotation[]> => {
  // In a real application, this would fetch from Supabase
  // const { data, error } = await supabase.from('quotations').select('*');
  // if (error) throw new Error(error.message);
  // return data;
  
  // For now, return mock data
  return Promise.resolve(mockQuotations);
};

export const fetchQuotationById = async (id: string): Promise<Quotation> => {
  // In a real application, this would fetch from Supabase
  // const { data, error } = await supabase.from('quotations').select('*').eq('id', id).single();
  // if (error) throw new Error(error.message);
  // if (!data) throw new Error('Quotation not found');
  // return data;
  
  // For now, return mock data
  const quotation = mockQuotations.find(q => q.id === id);
  if (!quotation) {
    return Promise.reject(new Error('Quotation not found'));
  }
  return Promise.resolve(quotation);
};

export const createQuotation = async (quotation: Omit<Quotation, 'id'>): Promise<Quotation> => {
  // In a real application, this would insert into Supabase
  // const { data, error } = await supabase.from('quotations').insert(quotation).select();
  // if (error) throw new Error(error.message);
  // return data[0];
  
  // For now, mock creation
  const newQuotation: Quotation = {
    ...quotation,
    id: `new-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return Promise.resolve(newQuotation);
};

export const updateQuotationStatus = async (id: string, status: Quotation['status']): Promise<Quotation> => {
  // In a real application, this would update Supabase
  // const { data, error } = await supabase.from('quotations').update({ status }).eq('id', id).select();
  // if (error) throw new Error(error.message);
  // return data[0];
  
  // For now, mock update
  const quotation = mockQuotations.find(q => q.id === id);
  if (!quotation) {
    return Promise.reject(new Error('Quotation not found'));
  }
  
  const updatedQuotation = { ...quotation, status, updatedAt: new Date().toISOString() };
  
  return Promise.resolve(updatedQuotation);
};

export const deleteQuotation = async (id: string): Promise<void> => {
  // In a real application, this would delete from Supabase
  // const { error } = await supabase.from('quotations').delete().eq('id', id);
  // if (error) throw new Error(error.message);
  
  // For now, just return a resolved promise
  return Promise.resolve();
};

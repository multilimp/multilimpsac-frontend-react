
import { supabase } from "@/integrations/supabase/client";
import { Quotation, QuotationItem } from "@/data/models/quotation";

// Define interfaces for database tables to help with type safety
interface CotizacionesDB {
  id: number;
  codigo_cotizacion: string;
  empresa_id?: number;
  cliente_id?: number;
  monto_total?: number;
  estado?: string;
  fecha_cotizacion?: string;
  fecha_entrega?: string;
  created_at?: string;
  updated_at?: string;
  clientes?: {
    razon_social?: string;
  };
}

interface CotizacionProductosDB {
  id: number;
  cotizacion_id: number;
  codigo?: string;
  descripcion?: string;
  cantidad?: number;
  precio_unitario?: number;
  total?: number;
}

export async function fetchQuotations(): Promise<Quotation[]> {
  try {
    // Using explicit type for the query result
    const { data: quotizacionesData, error } = await supabase
      .from('cotizaciones')
      .select(`
        id,
        codigo_cotizacion,
        empresa_id,
        cliente_id,
        monto_total,
        estado,
        fecha_cotizacion,
        fecha_entrega,
        created_at,
        updated_at,
        clientes:cliente_id (razon_social)
      `);

    if (error) {
      console.error("Error fetching quotations:", error);
      throw new Error(error.message);
    }

    if (!quotizacionesData) {
      return [];
    }

    // Transform the data to match our Quotation model
    const quotations: Quotation[] = await Promise.all(
      quotizacionesData.map(async (cotizacion: any) => {
        // Fetch quotation items for this quotation
        const { data: itemsData, error: itemsError } = await supabase
          .from('cotizacion_productos')
          .select('*')
          .eq('cotizacion_id', cotizacion.id);

        if (itemsError) {
          console.error("Error fetching quotation items:", itemsError);
          throw new Error(itemsError.message);
        }

        // Map items to our model
        const items: QuotationItem[] = (itemsData || []).map((item: any) => ({
          id: item.id.toString(),
          productId: item.codigo || '',
          productName: item.descripcion || '',
          description: item.descripcion || '',
          quantity: item.cantidad || 0,
          unitPrice: item.precio_unitario || 0,
          total: item.total || 0
        }));

        // Map the quotation to our model
        // Handle potential issue with cliente_id and razon_social
        const clientName = cotizacion.clientes && typeof cotizacion.clientes === 'object'
          ? cotizacion.clientes.razon_social || 'Cliente sin nombre'
          : 'Cliente sin nombre';
          
        return {
          id: cotizacion.id.toString(),
          number: cotizacion.codigo_cotizacion,
          clientId: cotizacion.cliente_id?.toString() || '',
          clientName,
          date: cotizacion.fecha_cotizacion || '',
          expiryDate: cotizacion.fecha_entrega || '',
          total: cotizacion.monto_total || 0,
          status: mapStatus(cotizacion.estado),
          items,
          createdBy: '',
          createdAt: cotizacion.created_at || '',
          updatedAt: cotizacion.updated_at || ''
        };
      })
    );

    return quotations;
  } catch (error) {
    console.error("Error in fetchQuotations:", error);
    throw error;
  }
}

// Function to map database status to our model status
function mapStatus(status: string | null | undefined): Quotation['status'] {
  if (!status) return 'draft';
  
  switch (status.toLowerCase()) {
    case 'enviada':
      return 'sent';
    case 'aprobada':
      return 'approved';
    case 'rechazada':
      return 'rejected';
    case 'vencida':
      return 'expired';
    default:
      return 'draft';
  }
}

export async function updateQuotationStatus(id: string, status: Quotation['status']): Promise<void> {
  try {
    // Map our model status to database status
    let dbStatus;
    switch (status) {
      case 'sent': dbStatus = 'enviada'; break;
      case 'approved': dbStatus = 'aprobada'; break;
      case 'rejected': dbStatus = 'rechazada'; break;
      case 'expired': dbStatus = 'vencida'; break;
      default: dbStatus = 'borrador';
    }

    const { error } = await supabase
      .from('cotizaciones')
      .update({ estado: dbStatus })
      .eq('id', parseInt(id));

    if (error) {
      console.error("Error updating quotation status:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in updateQuotationStatus:", error);
    throw error;
  }
}

export async function deleteQuotation(id: string): Promise<void> {
  try {
    // First delete related items to avoid foreign key constraints
    const { error: itemsError } = await supabase
      .from('cotizacion_productos')
      .delete()
      .eq('cotizacion_id', parseInt(id)) as any; // Using type assertion to resolve recursion

    if (itemsError) {
      console.error("Error deleting quotation items:", itemsError);
      throw new Error(itemsError.message);
    }

    // Then delete the quotation
    const { error } = await supabase
      .from('cotizaciones')
      .delete()
      .eq('id', parseInt(id)) as any; // Using type assertion to resolve recursion

    if (error) {
      console.error("Error deleting quotation:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error in deleteQuotation:", error);
    throw error;
  }
}

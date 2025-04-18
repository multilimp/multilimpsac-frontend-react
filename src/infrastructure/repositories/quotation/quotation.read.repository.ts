
import { supabase } from "@/integrations/supabase/client";
import { Quotation, QuotationItem } from "@/domain/quotation/models/quotation.model";
import { stringToNumberId } from "@/core/utils/id-conversions";
import { mapDbQuotationToDomain, mapDbQuotationItemToDomain } from "./utils/quotation-mappers";

export interface QuotationFilter {
  status?: Quotation['status'];
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

/**
 * Repository class for read operations on quotations
 */
export class QuotationReadRepository {
  /**
   * Gets all quotations with optional filtering and pagination
   */
  async getAll(
    filter?: QuotationFilter,
    pagination?: PaginationOptions
  ): Promise<{ data: Quotation[], count: number }> {
    try {
      let query = supabase
        .from('cotizaciones')
        .select(`
          id,
          codigo_cotizacion,
          cliente_id,
          clientes (razon_social),
          fecha_cotizacion,
          fecha_entrega,
          monto_total,
          estado,
          created_at,
          updated_at
        `, { count: 'exact' });
      
      // Apply filters
      if (filter) {
        if (filter.status) {
          const dbStatus = this.mapStatusToDb(filter.status);
          query = query.eq('estado', dbStatus);
        }
        
        if (filter.clientId) {
          query = query.eq('cliente_id', stringToNumberId(filter.clientId));
        }
        
        if (filter.fromDate) {
          query = query.gte('fecha_cotizacion', filter.fromDate);
        }
        
        if (filter.toDate) {
          query = query.lte('fecha_cotizacion', filter.toDate);
        }
        
        if (filter.searchTerm) {
          query = query.or(`codigo_cotizacion.ilike.%${filter.searchTerm}%,clientes.razon_social.ilike.%${filter.searchTerm}%`);
        }
      }
      
      // Apply sorting
      query = query.order('fecha_cotizacion', { ascending: false });
      
      // Apply pagination
      if (pagination) {
        const { page, pageSize } = pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw new Error(error.message);
      
      // Transform the data to match the Quotation interface
      return {
        data: data.map(item => mapDbQuotationToDomain(item, [])),
        count: count || 0
      };
    } catch (error) {
      console.error("Error fetching quotations:", error);
      return { data: [], count: 0 };
    }
  }

  /**
   * Gets a quotation by its ID with full details including items
   */
  async getById(id: string): Promise<Quotation> {
    try {
      // Get the quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('cotizaciones')
        .select(`
          id,
          codigo_cotizacion,
          cliente_id,
          clientes (razon_social),
          fecha_cotizacion,
          fecha_entrega,
          monto_total,
          estado,
          tipo_pago,
          nota_pago,
          nota_pedido,
          direccion_entrega,
          distrito_entrega,
          provincia_entrega,
          departamento_entrega,
          referencia_entrega,
          created_at,
          updated_at
        `)
        .eq('id', stringToNumberId(id))
        .single();
      
      if (quotationError) throw new Error(quotationError.message);
      
      // Get the quotation items
      const { data: items, error: itemsError } = await supabase
        .from('cotizacion_productos')
        .select('*')
        .eq('cotizacion_id', stringToNumberId(id));
      
      if (itemsError) throw new Error(itemsError.message);
      
      // Map the items
      const quotationItems: QuotationItem[] = items.map(item => mapDbQuotationItemToDomain(item));
      
      // Construct the full quotation
      return mapDbQuotationToDomain(quotation, quotationItems);
    } catch (error) {
      console.error("Error fetching quotation details:", error);
      throw error;
    }
  }

  /**
   * Maps domain status to DB status
   */
  private mapStatusToDb(status: Quotation['status']): string {
    switch (status) {
      case 'draft': return 'borrador';
      case 'sent': return 'enviada';
      case 'approved': return 'aprobada';
      case 'rejected': return 'rechazada';
      case 'expired': return 'vencida';
      default: return 'borrador';
    }
  }
}

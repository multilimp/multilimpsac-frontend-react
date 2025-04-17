
import { supabase } from "@/integrations/supabase/client";
import { Quotation, QuotationItem } from "@/domain/quotation/models/quotation.model";
import { stringToNumberId } from "@/core/utils/id-conversions";
import { mapDbQuotationToDomain, mapDbQuotationItemToDomain } from "./utils/quotation-mappers";

/**
 * Repository class for read operations on quotations
 */
export class QuotationReadRepository {
  /**
   * Gets all quotations
   */
  async getAll(): Promise<Quotation[]> {
    try {
      const { data, error } = await supabase
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
        `)
        .order('fecha_cotizacion', { ascending: false });
      
      if (error) throw new Error(error.message);
      
      // Transform the data to match the Quotation interface
      return data.map(item => mapDbQuotationToDomain(item, []));
    } catch (error) {
      console.error("Error fetching quotations:", error);
      return [];
    }
  }

  /**
   * Gets a quotation by its ID
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
}

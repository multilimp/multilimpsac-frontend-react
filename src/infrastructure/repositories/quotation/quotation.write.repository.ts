
import { supabase } from "@/integrations/supabase/client";
import { Quotation, QuotationFormInput } from "@/domain/quotation/models/quotation.model";
import { stringToNumberId } from "@/core/utils/id-conversions";
import { mapDbQuotationToDomain, mapDomainStatusToDb } from "./utils/quotation-mappers";
import { generateQuotationCode } from "./utils/quotation-code-generator";
import { QuotationReadRepository } from "./quotation.read.repository";

/**
 * Repository class for write operations on quotations
 */
export class QuotationWriteRepository {
  private readRepository: QuotationReadRepository;

  constructor() {
    this.readRepository = new QuotationReadRepository();
  }

  /**
   * Creates a new quotation
   */
  async create(data: QuotationFormInput): Promise<Quotation> {
    try {
      // Generate a new quotation code
      const quotationCode = await generateQuotationCode();
      
      // Calculate total
      const total = data.items.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice),
        0
      );
      
      // Insert quotation
      const { data: quotation, error: quotationError } = await supabase
        .from('cotizaciones')
        .insert({
          codigo_cotizacion: quotationCode,
          cliente_id: stringToNumberId(data.clientId),
          contacto_cliente_id: data.contactId ? stringToNumberId(data.contactId) : null,
          fecha_cotizacion: data.date,
          fecha_entrega: data.expiryDate,
          monto_total: total,
          estado: mapDomainStatusToDb(data.status),
          tipo_pago: data.paymentType,
          nota_pago: data.paymentNote,
          nota_pedido: data.orderNote,
          direccion_entrega: data.deliveryAddress,
          distrito_entrega: data.deliveryDistrict,
          provincia_entrega: data.deliveryProvince,
          departamento_entrega: data.deliveryDepartment,
          referencia_entrega: data.deliveryReference,
          empresa_id: 1 // Default empresa_id as required by the database schema
        })
        .select()
        .single();
      
      if (quotationError) throw new Error(quotationError.message);
      
      // Insert items
      const itemsPromises = data.items.map(item => {
        return supabase
          .from('cotizacion_productos')
          .insert({
            cotizacion_id: quotation.id,
            codigo: item.code,
            descripcion: item.description || item.productName,
            unidad_medida: item.unitMeasure,
            cantidad: item.quantity,
            precio_unitario: item.unitPrice,
            total: item.quantity * item.unitPrice
          });
      });
      
      // Wait for all items to be inserted
      const itemResults = await Promise.all(itemsPromises);
      
      // Check for errors in item insertions
      const itemErrors = itemResults.filter(result => result.error);
      if (itemErrors.length > 0) {
        throw new Error(`Error inserting items: ${itemErrors[0].error?.message}`);
      }
      
      // Return the created quotation
      return this.readRepository.getById(String(quotation.id));
    } catch (error) {
      console.error("Error creating quotation:", error);
      throw error;
    }
  }

  /**
   * Updates an existing quotation
   */
  async update(id: string, data: QuotationFormInput): Promise<Quotation> {
    try {
      // Calculate total
      const total = data.items.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice),
        0
      );
      
      const numericId = stringToNumberId(id);
      
      // Update quotation
      const { error: quotationError } = await supabase
        .from('cotizaciones')
        .update({
          cliente_id: stringToNumberId(data.clientId),
          contacto_cliente_id: data.contactId ? stringToNumberId(data.contactId) : null,
          fecha_cotizacion: data.date,
          fecha_entrega: data.expiryDate,
          monto_total: total,
          estado: mapDomainStatusToDb(data.status),
          tipo_pago: data.paymentType,
          nota_pago: data.paymentNote,
          nota_pedido: data.orderNote,
          direccion_entrega: data.deliveryAddress,
          distrito_entrega: data.deliveryDistrict,
          provincia_entrega: data.deliveryProvince,
          departamento_entrega: data.deliveryDepartment,
          referencia_entrega: data.deliveryReference
        })
        .eq('id', numericId);
      
      if (quotationError) throw new Error(quotationError.message);
      
      // Delete existing items
      const { error: deleteError } = await supabase
        .from('cotizacion_productos')
        .delete()
        .eq('cotizacion_id', numericId);
      
      if (deleteError) throw new Error(deleteError.message);
      
      // Insert new items
      const itemsPromises = data.items.map(item => {
        return supabase
          .from('cotizacion_productos')
          .insert({
            cotizacion_id: numericId,
            codigo: item.code,
            descripcion: item.description || item.productName,
            unidad_medida: item.unitMeasure,
            cantidad: item.quantity,
            precio_unitario: item.unitPrice,
            total: item.quantity * item.unitPrice
          });
      });
      
      // Wait for all items to be inserted
      const itemResults = await Promise.all(itemsPromises);
      
      // Check for errors in item insertions
      const itemErrors = itemResults.filter(result => result.error);
      if (itemErrors.length > 0) {
        throw new Error(`Error inserting items: ${itemErrors[0].error?.message}`);
      }
      
      // Return the updated quotation
      return this.readRepository.getById(id);
    } catch (error) {
      console.error("Error updating quotation:", error);
      throw error;
    }
  }

  /**
   * Updates the status of a quotation
   */
  async updateStatus(id: string, status: Quotation['status']): Promise<Quotation> {
    try {
      const { error } = await supabase
        .from('cotizaciones')
        .update({ 
          estado: mapDomainStatusToDb(status),
          updated_at: new Date().toISOString()
        })
        .eq('id', stringToNumberId(id));
      
      if (error) throw new Error(error.message);
      
      return this.readRepository.getById(id);
    } catch (error) {
      console.error("Error updating quotation status:", error);
      throw error;
    }
  }

  /**
   * Deletes a quotation
   */
  async delete(id: string): Promise<void> {
    try {
      const numericId = stringToNumberId(id);
      
      // Delete the quotation items first
      const { error: itemsError } = await supabase
        .from('cotizacion_productos')
        .delete()
        .eq('cotizacion_id', numericId);
      
      if (itemsError) throw new Error(itemsError.message);
      
      // Then delete the quotation
      const { error: quotationError } = await supabase
        .from('cotizaciones')
        .delete()
        .eq('id', numericId);
      
      if (quotationError) throw new Error(quotationError.message);
    } catch (error) {
      console.error("Error deleting quotation:", error);
      throw error;
    }
  }
}

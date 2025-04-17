
import { supabase } from "@/integrations/supabase/client";
import { Quotation, QuotationFormInput, QuotationItem } from "@/domain/quotation/models/quotation.model";
import { stringToNumberId, numberToStringId } from "@/core/utils/id-conversions";
import { mapDbQuotationToDomain, mapDbQuotationItemToDomain } from "./utils/quotation-mappers";

/**
 * Repository class for write operations on quotations
 */
export class QuotationWriteRepository {
  /**
   * Creates a new quotation
   */
  async create(data: QuotationFormInput): Promise<Quotation> {
    try {
      // Calculate total amount based on items
      const total = data.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice);
      }, 0);

      // Generate a unique quotation code (you might have a specific pattern)
      const quotationCode = `Q-${Date.now().toString().substring(5)}`;

      // Insert the quotation
      const { data: newQuotation, error: quotationError } = await supabase
        .from('cotizaciones')
        .insert([
          {
            codigo_cotizacion: quotationCode,
            cliente_id: data.clientId,
            contacto_cliente_id: data.contactId,
            fecha_cotizacion: data.date,
            fecha_entrega: data.expiryDate,
            monto_total: total,
            estado: data.status,
            tipo_pago: data.paymentType,
            nota_pago: data.paymentNote,
            nota_pedido: data.orderNote,
            direccion_entrega: data.deliveryAddress,
            distrito_entrega: data.deliveryDistrict,
            provincia_entrega: data.deliveryProvince,
            departamento_entrega: data.deliveryDepartment,
            referencia_entrega: data.deliveryReference
          }
        ])
        .select()
        .single();

      if (quotationError) throw new Error(quotationError.message);

      // Insert the quotation items
      const quotationItems: QuotationItem[] = [];
      for (const item of data.items) {
        const total = item.quantity * item.unitPrice;
        
        const { data: newItem, error: itemError } = await supabase
          .from('cotizacion_productos')
          .insert([
            {
              cotizacion_id: newQuotation.id,
              codigo: item.code,
              descripcion: item.description || item.productName,
              unidad_medida: item.unitMeasure,
              cantidad: item.quantity,
              precio_unitario: item.unitPrice,
              total: total
            }
          ])
          .select()
          .single();
          
        if (itemError) throw new Error(itemError.message);
        
        quotationItems.push(mapDbQuotationItemToDomain(newItem));
      }

      // Fetch client details to complete the quotation
      const { data: client, error: clientError } = await supabase
        .from('clientes')
        .select('razon_social')
        .eq('id', data.clientId)
        .single();
        
      if (clientError) throw new Error(clientError.message);

      // Construct and return the full quotation
      return {
        id: numberToStringId(newQuotation.id),
        number: newQuotation.codigo_cotizacion,
        clientId: numberToStringId(newQuotation.cliente_id),
        clientName: client.razon_social,
        date: newQuotation.fecha_cotizacion,
        expiryDate: newQuotation.fecha_entrega,
        total: newQuotation.monto_total,
        status: newQuotation.estado,
        items: quotationItems,
        paymentType: newQuotation.tipo_pago,
        paymentNote: newQuotation.nota_pago,
        orderNote: newQuotation.nota_pedido,
        deliveryAddress: newQuotation.direccion_entrega,
        deliveryDistrict: newQuotation.distrito_entrega,
        deliveryProvince: newQuotation.provincia_entrega,
        deliveryDepartment: newQuotation.departamento_entrega,
        deliveryReference: newQuotation.referencia_entrega,
        createdBy: "",
        createdAt: newQuotation.created_at,
        updatedAt: newQuotation.updated_at
      };
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
      // Calculate total amount based on items
      const total = data.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice);
      }, 0);

      // Update the quotation
      const { data: updatedQuotation, error: quotationError } = await supabase
        .from('cotizaciones')
        .update({
          cliente_id: data.clientId,
          contacto_cliente_id: data.contactId,
          fecha_cotizacion: data.date,
          fecha_entrega: data.expiryDate,
          monto_total: total,
          estado: data.status,
          tipo_pago: data.paymentType,
          nota_pago: data.paymentNote,
          nota_pedido: data.orderNote,
          direccion_entrega: data.deliveryAddress,
          distrito_entrega: data.deliveryDistrict,
          provincia_entrega: data.deliveryProvince,
          departamento_entrega: data.deliveryDepartment,
          referencia_entrega: data.deliveryReference
        })
        .eq('id', stringToNumberId(id))
        .select()
        .single();

      if (quotationError) throw new Error(quotationError.message);

      // Delete existing items and re-insert new ones
      const { error: deleteError } = await supabase
        .from('cotizacion_productos')
        .delete()
        .eq('cotizacion_id', stringToNumberId(id));

      if (deleteError) throw new Error(deleteError.message);

      // Insert the updated items
      const quotationItems: QuotationItem[] = [];
      for (const item of data.items) {
        const total = item.quantity * item.unitPrice;
        
        const { data: newItem, error: itemError } = await supabase
          .from('cotizacion_productos')
          .insert([
            {
              cotizacion_id: updatedQuotation.id,
              codigo: item.code,
              descripcion: item.description || item.productName,
              unidad_medida: item.unitMeasure,
              cantidad: item.quantity,
              precio_unitario: item.unitPrice,
              total: total
            }
          ])
          .select()
          .single();
          
        if (itemError) throw new Error(itemError.message);
        
        quotationItems.push(mapDbQuotationItemToDomain(newItem));
      }

      // Fetch client details to complete the quotation
      const { data: client, error: clientError } = await supabase
        .from('clientes')
        .select('razon_social')
        .eq('id', data.clientId)
        .single();
        
      if (clientError) throw new Error(clientError.message);

      // Construct and return the full quotation
      return {
        id: numberToStringId(updatedQuotation.id),
        number: updatedQuotation.codigo_cotizacion,
        clientId: numberToStringId(updatedQuotation.cliente_id),
        clientName: client.razon_social,
        date: updatedQuotation.fecha_cotizacion,
        expiryDate: updatedQuotation.fecha_entrega,
        total: updatedQuotation.monto_total,
        status: updatedQuotation.estado,
        items: quotationItems,
        paymentType: updatedQuotation.tipo_pago,
        paymentNote: updatedQuotation.nota_pago,
        orderNote: updatedQuotation.nota_pedido,
        deliveryAddress: updatedQuotation.direccion_entrega,
        deliveryDistrict: updatedQuotation.distrito_entrega,
        deliveryProvince: updatedQuotation.provincia_entrega,
        deliveryDepartment: updatedQuotation.departamento_entrega,
        deliveryReference: updatedQuotation.referencia_entrega,
        createdBy: "",
        createdAt: updatedQuotation.created_at,
        updatedAt: updatedQuotation.updated_at
      };
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
      const { data: updatedQuotation, error } = await supabase
        .from('cotizaciones')
        .update({ estado: status })
        .eq('id', stringToNumberId(id))
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
        .single();

      if (error) throw new Error(error.message);

      // Get the quotation items
      const { data: items, error: itemsError } = await supabase
        .from('cotizacion_productos')
        .select('*')
        .eq('cotizacion_id', stringToNumberId(id));
      
      if (itemsError) throw new Error(itemsError.message);
      
      // Map the items
      const quotationItems: QuotationItem[] = items.map(item => mapDbQuotationItemToDomain(item));
      
      // Return the updated quotation
      return mapDbQuotationToDomain(updatedQuotation, quotationItems);
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
      // First delete the related items
      const { error: deleteItemsError } = await supabase
        .from('cotizacion_productos')
        .delete()
        .eq('cotizacion_id', stringToNumberId(id));

      if (deleteItemsError) throw new Error(deleteItemsError.message);

      // Then delete the quotation
      const { error: deleteQuotationError } = await supabase
        .from('cotizaciones')
        .delete()
        .eq('id', stringToNumberId(id));

      if (deleteQuotationError) throw new Error(deleteQuotationError.message);
    } catch (error) {
      console.error("Error deleting quotation:", error);
      throw error;
    }
  }
}


import { supabase } from "@/integrations/supabase/client";
import { Quotation, QuotationItem } from "../models/quotation";
import { QuotationFormValues } from "../models/quotationForm.model";
import { QuotationRepository } from "./quotation.repository";
import { numberToStringId, stringToNumberId } from "../utils/id-conversions";

export class SupabaseQuotationRepository implements QuotationRepository {
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
      return data.map(item => ({
        id: numberToStringId(item.id),
        number: item.codigo_cotizacion,
        clientId: numberToStringId(item.cliente_id),
        clientName: item.clientes?.razon_social || "Cliente sin nombre",
        date: item.fecha_cotizacion,
        expiryDate: item.fecha_entrega,
        total: item.monto_total || 0,
        status: this.mapStatus(item.estado),
        items: [],
        createdBy: "system",
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error("Error fetching quotations:", error);
      return [];
    }
  }

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
      const quotationItems: QuotationItem[] = items.map(item => ({
        id: numberToStringId(item.id),
        productId: item.id ? numberToStringId(item.id) : undefined,
        productName: item.codigo || "",
        description: item.descripcion || "",
        quantity: item.cantidad || 0,
        unitPrice: item.precio_unitario || 0,
        total: item.total || 0,
        unitMeasure: item.unidad_medida
      }));
      
      // Construct the full quotation
      return {
        id: numberToStringId(quotation.id),
        number: quotation.codigo_cotizacion,
        clientId: numberToStringId(quotation.cliente_id),
        clientName: quotation.clientes?.razon_social || "Cliente sin nombre",
        date: quotation.fecha_cotizacion,
        expiryDate: quotation.fecha_entrega,
        total: quotation.monto_total || 0,
        status: this.mapStatus(quotation.estado),
        items: quotationItems,
        notes: quotation.nota_pedido,
        paymentNote: quotation.nota_pago,
        paymentType: quotation.tipo_pago,
        deliveryAddress: quotation.direccion_entrega,
        deliveryDistrict: quotation.distrito_entrega,
        deliveryProvince: quotation.provincia_entrega,
        deliveryDepartment: quotation.departamento_entrega,
        deliveryReference: quotation.referencia_entrega,
        createdBy: "system",
        createdAt: quotation.created_at,
        updatedAt: quotation.updated_at
      };
    } catch (error) {
      console.error("Error fetching quotation details:", error);
      throw error;
    }
  }

  async create(data: QuotationFormValues): Promise<Quotation> {
    try {
      // Generate a new quotation code
      const quotationCode = await this.generateQuotationCode();
      
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
          estado: this.mapStatusToDb(data.status),
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
      const itemsToInsert = data.items.map(item => ({
        cotizacion_id: quotation.id,
        codigo: item.code,
        descripcion: item.description,
        unidad_medida: item.unitMeasure,
        cantidad: item.quantity,
        precio_unitario: item.unitPrice,
        total: item.quantity * item.unitPrice
      }));
      
      const { error: itemsError } = await supabase
        .from('cotizacion_productos')
        .insert(itemsToInsert);
      
      if (itemsError) throw new Error(itemsError.message);
      
      // Return the created quotation
      return {
        id: numberToStringId(quotation.id),
        number: quotationCode,
        clientId: data.clientId,
        clientName: "", // Will be populated when retrieving
        date: data.date,
        expiryDate: data.expiryDate,
        total: total,
        status: data.status as Quotation['status'],
        items: data.items.map(item => ({
          id: item.id || "",
          productId: item.productId,
          productName: item.productName,
          description: item.description || "",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          unitMeasure: item.unitMeasure
        })),
        notes: data.orderNote,
        paymentNote: data.paymentNote,
        paymentType: data.paymentType,
        deliveryAddress: data.deliveryAddress,
        deliveryDistrict: data.deliveryDistrict,
        deliveryProvince: data.deliveryProvince,
        deliveryDepartment: data.deliveryDepartment,
        deliveryReference: data.deliveryReference,
        createdBy: "system",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error creating quotation:", error);
      throw error;
    }
  }

  async update(id: string, data: QuotationFormValues): Promise<Quotation> {
    try {
      // Calculate total
      const total = data.items.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice),
        0
      );
      
      // Update quotation
      const { error: quotationError } = await supabase
        .from('cotizaciones')
        .update({
          cliente_id: stringToNumberId(data.clientId),
          contacto_cliente_id: data.contactId ? stringToNumberId(data.contactId) : null,
          fecha_cotizacion: data.date,
          fecha_entrega: data.expiryDate,
          monto_total: total,
          estado: this.mapStatusToDb(data.status),
          tipo_pago: data.paymentType,
          nota_pago: data.paymentNote,
          nota_pedido: data.orderNote,
          direccion_entrega: data.deliveryAddress,
          distrito_entrega: data.deliveryDistrict,
          provincia_entrega: data.deliveryProvince,
          departamento_entrega: data.deliveryDepartment,
          referencia_entrega: data.deliveryReference
        })
        .eq('id', stringToNumberId(id));
      
      if (quotationError) throw new Error(quotationError.message);
      
      // Delete existing items
      const { error: deleteError } = await supabase
        .from('cotizacion_productos')
        .delete()
        .eq('cotizacion_id', stringToNumberId(id));
      
      if (deleteError) throw new Error(deleteError.message);
      
      // Insert new items
      const numericId = stringToNumberId(id);
      const itemsToInsert = data.items.map(item => ({
        cotizacion_id: numericId,
        codigo: item.code,
        descripcion: item.description,
        unidad_medida: item.unitMeasure,
        cantidad: item.quantity,
        precio_unitario: item.unitPrice,
        total: item.quantity * item.unitPrice
      }));
      
      const { error: itemsError } = await supabase
        .from('cotizacion_productos')
        .insert(itemsToInsert);
      
      if (itemsError) throw new Error(itemsError.message);
      
      // Return the updated quotation
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating quotation:", error);
      throw error;
    }
  }

  async updateStatus(id: string, status: Quotation['status']): Promise<Quotation> {
    try {
      const { error } = await supabase
        .from('cotizaciones')
        .update({ 
          estado: this.mapStatusToDb(status),
          updated_at: new Date().toISOString()
        })
        .eq('id', stringToNumberId(id));
      
      if (error) throw new Error(error.message);
      
      return this.getById(id);
    } catch (error) {
      console.error("Error updating quotation status:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      // Delete the quotation items first
      const { error: itemsError } = await supabase
        .from('cotizacion_productos')
        .delete()
        .eq('cotizacion_id', stringToNumberId(id));
      
      if (itemsError) throw new Error(itemsError.message);
      
      // Then delete the quotation
      const { error: quotationError } = await supabase
        .from('cotizaciones')
        .delete()
        .eq('id', stringToNumberId(id));
      
      if (quotationError) throw new Error(quotationError.message);
    } catch (error) {
      console.error("Error deleting quotation:", error);
      throw error;
    }
  }

  private mapStatus(status: string | null): Quotation['status'] {
    switch (status) {
      case 'aprobada': return 'approved';
      case 'rechazada': return 'rejected';
      case 'enviada': return 'sent';
      case 'vencida': return 'expired';
      default: return 'draft';
    }
  }

  private mapStatusToDb(status: string): string {
    switch (status) {
      case 'approved': return 'aprobada';
      case 'rejected': return 'rechazada';
      case 'sent': return 'enviada';
      case 'expired': return 'vencida';
      default: return 'borrador';
    }
  }

  private async generateQuotationCode(): Promise<string> {
    try {
      // Get the current year
      const currentYear = new Date().getFullYear();
      
      // Get the count of quotations for the current year
      const { count, error } = await supabase
        .from('cotizaciones')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_cotizacion', `${currentYear}-01-01`)
        .lte('fecha_cotizacion', `${currentYear}-12-31`);
      
      if (error) throw new Error(error.message);
      
      // Generate a sequential number (count + 1) with padding
      const sequential = String(Number(count || 0) + 1).padStart(3, '0');
      
      // Format: COT-YYYY-NNN
      return `COT-${currentYear}-${sequential}`;
    } catch (error) {
      console.error("Error generating quotation code:", error);
      // Fallback code generation
      return `COT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }
  }
}

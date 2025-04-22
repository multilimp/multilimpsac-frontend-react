
import { supabase } from "@/integrations/supabase/client";
import { PurchaseOrder } from "@/features/processes/purchase-orders/models/purchaseOrder";

export async function fetchSales(): Promise<PurchaseOrder[]> {
  try {
    const { data, error } = await supabase
      .from('ordenes_compra')
      .select(`
        id,
        codigo_venta,
        cliente_id,
        clientes (
          razon_social,
          ruc,
          cod_unidad
        ),
        catalogo_empresa_id,
        catalogo_empresas (
          codigo
        ),
        fecha_form,
        fecha_max_form,
        monto_venta,
        departamento_entrega,
        contacto_cliente_id,
        contacto_clientes (
          nombre,
          telefono,
          correo
        ),
        documento_oce,
        documento_ocf
      `)
      .order('fecha_form', { ascending: false });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id.toString(),
      orderNumber: item.codigo_venta,
      clientId: item.cliente_id.toString(),
      clientName: item.clientes?.razon_social || "",
      clientRuc: item.clientes?.ruc || "",
      codUnidad: item.clientes?.cod_unidad || "",
      catalogo: item.catalogo_empresas?.codigo || "",
      fecha_form: item.fecha_form,
      fecha_max_form: item.fecha_max_form,
      monto_venta: item.monto_venta,
      departamento_entrega: item.departamento_entrega,
      contact: item.contacto_clientes ? {
        name: item.contacto_clientes.nombre,
        phone: item.contacto_clientes.telefono,
        email: item.contacto_clientes.correo
      } : null,
      documento_oce: item.documento_oce,
      documento_ocf: item.documento_ocf,
      date: item.fecha_form, // Add date property
      total: item.monto_venta || 0,
      status: "pending",
      type: "public",
      documents: {},
      items: [],
      createdAt: item.fecha_form || "",
      updatedAt: item.fecha_form || ""
    }));
  } catch (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
}

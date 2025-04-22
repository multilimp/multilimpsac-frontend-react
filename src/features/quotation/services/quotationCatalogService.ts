
import { supabase } from "@/integrations/supabase/client";

// Definición para el catálogo de cotizaciones
export interface QuotationCatalogRow {
  id: string;
  codigoCotizacion: string;
  rucCliente: string;
  region: string;
  montoTotal: number;
  fechaEntrega: string | null;
  fechaCotizacion: string | null;
  estado: "cotizado" | "aprobado" | "rechazado";
}

// Mapea estado de db → catálogo
function mapDbStatusToCatalog(status: string | null): QuotationCatalogRow["estado"] {
  switch (status) {
    case "aprobada":
      return "aprobado";
    case "rechazada":
      return "rechazado";
    // "borrador", "cotizado", "enviada" o null serán "cotizado"
    default:
      return "cotizado";
  }
}

// Trae todas las cotizaciones, solo campos requeridos, desde Supabase
export async function fetchAllQuotationCatalog(): Promise<QuotationCatalogRow[]> {
  const { data, error } = await supabase
    .from("cotizaciones")
    .select(`
      id,
      codigo_cotizacion,
      clientes:cliente_id(ruc, razon_social, departamento, provincia, distrito), 
      monto_total,
      fecha_entrega,
      fecha_cotizacion,
      estado
    `)
    .order("fecha_cotizacion", { ascending: false });

  if (error) throw new Error(error.message);

  // Extrae region. En este contexto usamos "departamento" del cliente como "región"
  return (data ?? []).map((row: any) => ({
    id: row.id.toString(),
    codigoCotizacion: row.codigo_cotizacion,
    rucCliente: row.clientes?.ruc || "",
    region: row.clientes?.departamento || "",
    montoTotal: row.monto_total || 0,
    fechaEntrega: row.fecha_entrega ?? null,
    fechaCotizacion: row.fecha_cotizacion ?? null,
    estado: mapDbStatusToCatalog(row.estado ?? "")
  }));
}

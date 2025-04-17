
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a sequential quotation code in the format COT-YYYY-NNN
 * where YYYY is the current year and NNN is a sequential number
 */
export async function generateQuotationCode(): Promise<string> {
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

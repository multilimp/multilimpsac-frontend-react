
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a unique quotation code
 * Format: Q-YYYYMM-XXX where XXX is an incremental number
 */
export async function generateQuotationCode(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `Q-${year}${month}`;
  
  try {
    // Get the latest quotation with the same prefix
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('codigo_cotizacion')
      .like('codigo_cotizacion', `${prefix}%`)
      .order('codigo_cotizacion', { ascending: false })
      .limit(1);
    
    if (error) throw new Error(error.message);
    
    let number = 1;
    
    if (data && data.length > 0) {
      // Extract the number from the latest code
      const latestCode = data[0].codigo_cotizacion;
      const parts = latestCode.split('-');
      if (parts.length === 3) {
        const latestNumber = parseInt(parts[2]);
        if (!isNaN(latestNumber)) {
          number = latestNumber + 1;
        }
      }
    }
    
    // Format the number with leading zeros (e.g., 001, 012, 123)
    const formattedNumber = String(number).padStart(3, '0');
    
    return `${prefix}-${formattedNumber}`;
  } catch (error) {
    console.error("Error generating quotation code:", error);
    // Fallback to a timestamp-based code
    return `${prefix}-${Date.now().toString().slice(-5)}`;
  }
}


import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { QuotationFormValues } from "./QuotationFormTypes";

interface QuotationSummarySectionProps {
  form: UseFormReturn<QuotationFormValues>;
  calculateTotal: () => number;
}

const QuotationSummarySection: React.FC<QuotationSummarySectionProps> = ({ form, calculateTotal }) => {
  return (
    <>
      <div className="flex justify-end">
        <div className="bg-muted p-4 rounded-md">
          <div className="font-medium">Total: ${calculateTotal().toFixed(2)}</div>
        </div>
      </div>
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notas</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Observaciones o comentarios adicionales" 
                className="resize-none" 
                rows={3} 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default QuotationSummarySection;


import React from "react";
import { UseFormReturn } from "react-hook-form";
import { QuotationFormValues } from "../../models/quotationForm.model";
import { formatCurrency } from "@/app/core/utils";

interface QuotationSummarySectionProps {
  form: UseFormReturn<QuotationFormValues>;
}

const QuotationSummarySection: React.FC<QuotationSummarySectionProps> = ({ form }) => {
  const items = form.watch("items");
  
  const subtotal = items.reduce((sum, item) => {
    const quantity = item.quantity || 0;
    const price = item.unitPrice || 0;
    return sum + (quantity * price);
  }, 0);
  
  // Peruvian IGV (18%)
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Resumen</h3>
      
      <div className="bg-muted p-4 rounded-md space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">IGV (18%):</span>
          <span>{formatCurrency(igv)}</span>
        </div>
        <div className="border-t border-border mt-2 pt-2 flex justify-between font-medium">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuotationSummarySection;

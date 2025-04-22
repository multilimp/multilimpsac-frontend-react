
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { QuotationFormValues } from "../../../processes/quotation/models/quotationForm.model";

interface QuotationPaymentSectionProps {
  form: UseFormReturn<QuotationFormValues>;
}

const paymentOptions = [
  { value: "contado", label: "Contado" },
  { value: "credito-7", label: "Crédito a 7 días" },
  { value: "credito-15", label: "Crédito a 15 días" },
  { value: "credito-30", label: "Crédito a 30 días" },
  { value: "credito-45", label: "Crédito a 45 días" },
  { value: "credito-60", label: "Crédito a 60 días" },
  { value: "otro", label: "Otro" },
];

const QuotationPaymentSection: React.FC<QuotationPaymentSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Condiciones de Pago</h3>
      
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Pago</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="paymentNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota de Pago</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Condiciones adicionales de pago"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="orderNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota de Pedido</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Notas adicionales para el pedido"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default QuotationPaymentSection;


import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { QuotationFormValues } from "../../models/quotationForm.model";

interface QuotationDeliverySectionProps {
  form: UseFormReturn<QuotationFormValues>;
}

const QuotationDeliverySection: React.FC<QuotationDeliverySectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Información de Entrega</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="deliveryAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección de Entrega</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Dirección completa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryReference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referencia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Punto de referencia" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryDistrict"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distrito</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Distrito" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryProvince"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provincia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Provincia" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="deliveryDepartment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Departamento" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default QuotationDeliverySection;

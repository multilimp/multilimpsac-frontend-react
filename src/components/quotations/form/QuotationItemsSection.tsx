
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { QuotationFormValues } from "./QuotationFormTypes";
import { Plus, X } from "lucide-react";

interface QuotationItemsSectionProps {
  form: UseFormReturn<QuotationFormValues>;
}

const QuotationItemsSection: React.FC<QuotationItemsSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Ítems</h3>
      <Separator />
      
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name={`items.${index}.productName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Producto</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre del producto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-12 md:col-span-3">
            <FormField
              control={form.control}
              name={`items.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Descripción</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descripción" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-4 md:col-span-2">
            <FormField
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Cant.</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-4 md:col-span-2">
            <FormField
              control={form.control}
              name={`items.${index}.unitPrice`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={index !== 0 ? "sr-only" : ""}>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={0} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-4 md:col-span-1">
            <FormLabel className={index !== 0 ? "sr-only" : ""}>Total</FormLabel>
            <div className="h-10 mt-2 flex items-center font-medium">
              ${((form.watch(`items.${index}.quantity`) || 0) * 
                 (form.watch(`items.${index}.unitPrice`) || 0)).toFixed(2)}
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-12 flex justify-end -mt-2">
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            )}
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ productName: "", description: "", quantity: 1, unitPrice: 0 })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar ítem
      </Button>
    </div>
  );
};

export default QuotationItemsSection;

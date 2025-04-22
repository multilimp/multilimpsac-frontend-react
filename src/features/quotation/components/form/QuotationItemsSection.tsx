
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { QuotationFormValues } from "../../../processes/quotation/models/quotationForm.model";
import { Plus, X } from "lucide-react";

interface QuotationItemsSectionProps {
  form: UseFormReturn<QuotationFormValues>;
}

const QuotationItemsSection: React.FC<QuotationItemsSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const calculateItemTotal = (index: number) => {
    const quantity = form.watch(`items.${index}.quantity`) || 0;
    const price = form.watch(`items.${index}.unitPrice`) || 0;
    return quantity * price;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Ítems de la Cotización</h3>
      <Separator />
      
      <div className="rounded-md border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 bg-muted p-3 text-sm font-medium">
          <div className="col-span-12 md:col-span-3">Producto</div>
          <div className="col-span-12 md:col-span-3">Descripción</div>
          <div className="col-span-3 md:col-span-2">Unidad</div>
          <div className="col-span-3 md:col-span-1">Cant.</div>
          <div className="col-span-3 md:col-span-1">Precio</div>
          <div className="col-span-3 md:col-span-1">Total</div>
          <div className="col-span-12 md:col-span-1"></div>
        </div>
        
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 p-3 border-t">
            <div className="col-span-12 md:col-span-3">
              <FormField
                control={form.control}
                name={`items.${index}.productName`}
                render={({ field }) => (
                  <FormItem>
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
                    <FormControl>
                      <Input {...field} placeholder="Descripción" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="col-span-3 md:col-span-2">
              <FormField
                control={form.control}
                name={`items.${index}.unitMeasure`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Unidad" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="col-span-3 md:col-span-1">
              <FormField
                control={form.control}
                name={`items.${index}.unitPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="col-span-3 md:col-span-1 flex items-center font-medium">
              S/ {calculateItemTotal(index).toFixed(2)}
            </div>
            
            <div className="col-span-12 md:col-span-1 flex items-center justify-center">
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
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

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Save, X } from "lucide-react";

import { 
  Form,
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/data/models";

// Mock clients for the dropdown
const mockClients: Client[] = [
  { id: "1", name: "Empresa ABC", ruc: "12345678901", address: "Av. Principal 123", email: "contacto@abc.com", contactPerson: "Juan Pérez", active: true, createdAt: "2023-01-01" },
  { id: "2", name: "Empresa XYZ", ruc: "23456789012", address: "Calle Secundaria 456", email: "contacto@xyz.com", contactPerson: "María García", active: true, createdAt: "2023-02-15" },
  { id: "3", name: "Corporación DEF", ruc: "34567890123", address: "Jr. Comercial 789", email: "contacto@def.com", contactPerson: "Carlos López", active: true, createdAt: "2023-03-20" }
];

// Form validation schema
const quotationFormSchema = z.object({
  clientId: z.string({
    required_error: "Por favor seleccione un cliente",
  }),
  date: z.string({
    required_error: "Por favor ingrese una fecha",
  }),
  expiryDate: z.string({
    required_error: "Por favor ingrese una fecha de expiración",
  }),
  items: z.array(z.object({
    productName: z.string().min(1, "El nombre del producto es requerido"),
    description: z.string().optional(),
    quantity: z.coerce.number().min(1, "La cantidad debe ser mayor que 0"),
    unitPrice: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  })).min(1, "Debe agregar al menos un ítem"),
  notes: z.string().optional(),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

interface QuotationFormProps {
  onSuccess: () => void;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ productName: "", description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });
  
  const onSubmit = (data: QuotationFormValues) => {
    console.log("Form data:", data);
    toast({
      title: "Cotización creada",
      description: "La cotización ha sido creada exitosamente",
    });
    onSuccess();
  };
  
  // Calculate total based on form values
  const calculateTotal = () => {
    const items = form.watch("items");
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Cotización</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockClients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de expiración</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Items */}
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
            
            <div className="flex justify-end">
              <div className="bg-muted p-4 rounded-md">
                <div className="font-medium">Total: ${calculateTotal().toFixed(2)}</div>
              </div>
            </div>
            
            {/* Notes */}
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cotización
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default QuotationForm;

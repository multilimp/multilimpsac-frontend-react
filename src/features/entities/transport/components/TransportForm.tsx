
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Transport } from "../models/transport.model";
import AddressForm from "@/components/forms/AddressForm";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const transportSchema = z.object({
  razon_social: z.string().min(1, "La razón social es obligatoria"),
  ruc: z.string().regex(/^\d{11}$/, "El RUC debe tener 11 dígitos"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  cobertura: z.string().optional(),
  departamento: z.string().optional(),
  provincia: z.string().optional(),
  distrito: z.string().optional(),
  estado: z.boolean().default(true),
});

interface TransportFormProps {
  transport?: Transport;
  onSubmit: (data: Partial<Transport>) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const TransportForm: React.FC<TransportFormProps> = ({
  transport,
  onSubmit,
  isSubmitting = false,
  onCancel,
}) => {
  const isEditMode = !!transport;

  const form = useForm<z.infer<typeof transportSchema>>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      razon_social: transport?.razon_social || "",
      ruc: transport?.ruc || "",
      direccion: transport?.direccion || "",
      cobertura: transport?.cobertura || "",
      departamento: transport?.departamento || "",
      provincia: transport?.provincia || "",
      distrito: transport?.distrito || "",
      estado: transport?.estado ?? true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof transportSchema>) => {
    await onSubmit(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Editar Transporte" : "Nuevo Transporte"}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="razon_social"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre de la empresa transportista" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ruc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUC *</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de RUC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cobertura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cobertura</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Zonas donde brinda servicios (nacional, local, etc.)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <AddressForm
                  control={form.control}
                  addressField="direccion"
                  departmentField="departamento"
                  provinceField="provincia"
                  districtField="distrito"
                  required={true}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        )}
        <Button 
          onClick={form.handleSubmit(handleSubmit)} 
          disabled={isLoading}
        >
          {isLoading ? "Guardando..." : isEditMode ? "Actualizar" : "Crear"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransportForm;

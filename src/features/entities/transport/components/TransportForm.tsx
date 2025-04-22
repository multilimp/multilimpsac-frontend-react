import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Transport } from "../../../entities/transport/models/transport.model";

const transportSchema = z.object({
  razon_social: z.string().min(3, { message: "La razón social debe tener al menos 3 caracteres" }),
  ruc: z.string().length(11, { message: "El RUC debe tener 11 dígitos" }).regex(/^\d+$/, { message: "El RUC debe contener solo números" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  departamento: z.string().min(1, { message: "El departamento es requerido" }),
  provincia: z.string().min(1, { message: "La provincia es requerida" }),
  distrito: z.string().min(1, { message: "El distrito es requerido" }),
  cobertura: z.string().optional(),
  estado: z.boolean().default(true),
});

type TransportFormData = z.infer<typeof transportSchema>;

export interface TransportFormProps {
  transport?: Partial<Transport>;
  onSubmit: (data: Partial<Transport>) => Promise<void>;
  isSubmitting?: boolean;
}

export const TransportForm: React.FC<TransportFormProps> = ({
  transport = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<TransportFormData>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      razon_social: transport.razon_social || "",
      ruc: transport.ruc || "",
      direccion: transport.direccion || "",
      departamento: transport.departamento || "",
      provincia: transport.provincia || "",
      distrito: transport.distrito || "",
      cobertura: transport.cobertura || "",
      estado: transport.estado !== undefined ? transport.estado : true,
    },
  });

  async function handleSubmit(values: TransportFormData) {
    try {
      await onSubmit({
        ...transport,
        ...values
      });
    } catch (error) {
      console.error("Error al guardar transporte:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Editar Transporte' : 'Nuevo Transporte'}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="razon_social"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razón Social</FormLabel>
                    <FormControl>
                      <Input placeholder="Razón Social" {...field} />
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
                    <FormLabel>RUC</FormLabel>
                    <FormControl>
                      <Input placeholder="RUC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Departamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <FormControl>
                      <Input placeholder="Provincia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distrito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distrito</FormLabel>
                    <FormControl>
                      <Input placeholder="Distrito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="cobertura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cobertura</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describa las zonas de cobertura del transporte" 
                      className="resize-none min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

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
import { Textarea } from "@/components/ui/textarea";
import { Cliente } from "../models/client.model";

// Esquema de validación con Zod
const clienteSchema = z.object({
  razonSocial: z.string().min(3, { message: "La razón social debe tener al menos 3 caracteres" }),
  ruc: z.string().length(11, { message: "El RUC debe tener 11 dígitos" }).regex(/^\d+$/, { message: "El RUC debe contener solo números" }),
  codUnidad: z.string().min(1, { message: "El código de unidad es requerido" }),
  departamento: z.string().optional(),
  provincia: z.string().optional(),
  distrito: z.string().optional(),
  direccion: z.string().optional(),
  estado: z.boolean().default(true),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  initialData?: Partial<Cliente>;
  onSubmit: (data: Partial<Cliente>) => Promise<void>;
  isSubmitting?: boolean;
  isNewCliente?: boolean;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  isNewCliente = false,
}) => {
  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      razonSocial: initialData.razonSocial || "",
      ruc: initialData.ruc || "",
      codUnidad: initialData.codUnidad || "",
      departamento: initialData.departamento || "",
      provincia: initialData.provincia || "",
      distrito: initialData.distrito || "",
      direccion: initialData.direccion || "",
      estado: initialData.estado !== undefined ? initialData.estado : true,
    },
  });

  async function handleSubmit(values: ClienteFormData) {
    try {
      await onSubmit({
        ...initialData,
        ...values
      });
      if (isNewCliente) {
        form.reset();
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="razonSocial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social*</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>RUC*</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={11} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="codUnidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Unidad*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  onValueChange={(value) => field.onChange(value === "true")} 
                  defaultValue={field.value ? "true" : "false"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : isNewCliente ? 'Crear Cliente' : 'Actualizar Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
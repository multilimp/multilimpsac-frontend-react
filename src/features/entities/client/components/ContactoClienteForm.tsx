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
  SelectValue,
} from "@/components/ui/select";
import { ClientContact } from "../models/client.model";

// Esquema de validación con Zod
const contactoSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  telefono: z.string().optional(),
  correo: z.string().optional(),
  cargo: z.string().optional(),
  estado: z.boolean().default(true),
});

type ContactoFormData = z.infer<typeof contactoSchema>;

interface ContactoClienteFormProps {
  clienteId: string;
  initialData?: Partial<ClientContact>;
  onSubmit: (data: Partial<ClientContact>) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const ContactoClienteForm: React.FC<ContactoClienteFormProps> = ({
  clienteId,
  initialData = {},
  onSubmit,
  isSubmitting = false,
  onCancel,
}) => {
  const isNew = !initialData.id;

  const form = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      nombre: initialData.nombre || "",
      telefono: initialData.telefono || "",
      correo: initialData.correo || "",
      cargo: initialData.cargo || "",
      estado: initialData.estado !== undefined ? initialData.estado : true,
    },
  });

  async function handleSubmit(values: ContactoFormData) {
    try {
      await onSubmit({
        ...initialData,
        clientId: clienteId,
        ...values,
      });
      
      if (isNew) {
        form.reset();
      }
    } catch (error) {
      console.error("Error al guardar contacto:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
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

        <div className="flex justify-end space-x-2 pt-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : isNew ? 'Crear Contacto' : 'Actualizar Contacto'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

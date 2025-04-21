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
import { CompanyCatalog } from "../models/company.model";

// Esquema de validación con Zod
const catalogSchema = z.object({
  codigo: z.string().min(1, { message: "El código es requerido" }),
});

type CatalogFormData = z.infer<typeof catalogSchema>;

interface CatalogFormProps {
  initialData?: Partial<CompanyCatalog>;
  onSubmit: (data: Partial<CompanyCatalog>) => Promise<void>;
  isSubmitting?: boolean;
}

export const CatalogForm: React.FC<CatalogFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<CatalogFormData>({
    resolver: zodResolver(catalogSchema),
    defaultValues: {
      codigo: initialData?.codigo || "",
    },
  });

  async function handleSubmit(values: CatalogFormData) {
    try {
      await onSubmit({
        ...initialData,
        ...values
      });
      if (!initialData.id) {
        form.reset();
      }
    } catch (error) {
      console.error("Error al guardar catálogo:", error);
    }
  }

  const isNewCatalog = !initialData.id;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
            {isSubmitting ? 'Guardando...' : isNewCatalog ? 'Crear Catálogo' : 'Actualizar Catálogo'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
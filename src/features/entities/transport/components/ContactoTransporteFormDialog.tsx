
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TransportContact } from '../models/transportContact.model';

const contactSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es requerido' }),
  cargo: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  estado: z.boolean().default(true),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export interface ContactoTransporteFormDialogProps {
  contacto: TransportContact | null;
  transporteId: string; // Added transporteId prop
  onSubmit: (data: Partial<TransportContact>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ContactoTransporteFormDialog: React.FC<ContactoTransporteFormDialogProps> = ({
  contacto,
  transporteId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nombre: contacto?.name || '',
      cargo: contacto?.position || '',
      telefono: contacto?.phone || '',
      correo: contacto?.email || '',
      estado: contacto?.status === 'active',
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      await onSubmit({
        id: contacto?.id,
        transportId: transporteId,
        name: values.nombre,
        position: values.cargo,
        phone: values.telefono,
        email: values.correo,
        status: values.estado ? 'active' : 'inactive'
      });
      
      if (!contacto) {
        form.reset();
      }
    } catch (error) {
      console.error('Error al guardar contacto:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Input type="email" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Activo</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : contacto?.id ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactoTransporteFormDialog;

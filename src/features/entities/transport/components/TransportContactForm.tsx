
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TransportContact } from '../models/transportContact.model';

const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  position: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Correo electrónico inválido').optional().or(z.string().length(0)),
  status: z.enum(['active', 'inactive']).default('active'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface TransportContactFormProps {
  contact: TransportContact | null;
  onSubmit: (data: Partial<TransportContact>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TransportContactForm: React.FC<TransportContactFormProps> = ({
  contact,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || '',
      position: contact?.position || '',
      phone: contact?.phone || '',
      email: contact?.email || '',
      status: contact?.status || 'active',
    }
  });

  const handleFormSubmit = async (values: ContactFormValues) => {
    try {
      await onSubmit({
        ...contact,
        ...values,
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="position"
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
          name="phone"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : contact?.id ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransportContactForm;

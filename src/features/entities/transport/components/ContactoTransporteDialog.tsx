
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransportContact } from '../models/transportContact.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

export interface ContactoTransporteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacto: TransportContact | null;
  transporteId: string;
  onSubmit: (data: Partial<TransportContact>) => Promise<void>;
  isSubmitting: boolean;
}

const contactoSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  position: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Debe ser un email válido').optional().or(z.literal('')),
  status: z.boolean().default(true),
});

export const ContactoTransporteDialog: React.FC<ContactoTransporteFormDialogProps> = ({
  open,
  onOpenChange,
  contacto,
  transporteId,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<z.infer<typeof contactoSchema>>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      name: contacto?.name || '',
      position: contacto?.position || '',
      phone: contacto?.phone || '',
      email: contacto?.email || '',
      status: contacto ? contacto.status === 'active' : true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof contactoSchema>) => {
    await onSubmit({
      ...values,
      transportId: transporteId,
      status: values.status ? 'active' : 'inactive',
    });
    form.reset();
  };

  React.useEffect(() => {
    if (open && contacto) {
      form.reset({
        name: contacto.name,
        position: contacto.position || '',
        phone: contacto.phone || '',
        email: contacto.email || '',
        status: contacto.status === 'active',
      });
    } else if (open && !contacto) {
      form.reset({
        name: '',
        position: '',
        phone: '',
        email: '',
        status: true,
      });
    }
  }, [open, contacto, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{contacto ? 'Editar contacto' : 'Nuevo contacto'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre completo" />
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
                    <Input {...field} placeholder="Cargo en la empresa" />
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
                    <Input {...field} placeholder="Número de contacto" />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="correo@ejemplo.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Activo</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactoTransporteDialog;

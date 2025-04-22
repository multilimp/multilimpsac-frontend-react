import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { TransportContact } from '../../../transport/models/transport.model';

const contactoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  cargo: z.string().min(1, "El cargo es requerido"),
  email: z.string().email("Email inválido").or(z.string().length(0)),
  telefono: z.string().min(1, "El teléfono es requerido"),
});

type ContactoFormValues = z.infer<typeof contactoSchema>;

interface ContactoTransporteFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ContactoFormValues) => void;
  contacto?: TransportContact | null;
  isLoading: boolean;
}

const ContactoTransporteFormDialog: React.FC<ContactoTransporteFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contacto,
  isLoading,
}) => {
  const isEditing = !!contacto;
  
  const form = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      nombre: contacto?.nombre || '',
      cargo: contacto?.cargo || '',
      email: contacto?.email || '',
      telefono: contacto?.telefono || '',
    },
  });
  
  // Reset form when contacto changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        nombre: contacto?.nombre || '',
        cargo: contacto?.cargo || '',
        email: contacto?.email || '',
        telefono: contacto?.telefono || '',
      });
    }
  }, [form, contacto, isOpen]);
  
  const handleSubmit = (values: ContactoFormValues) => {
    onSubmit(values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Contacto' : 'Añadir Contacto'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza los datos del contacto de transporte.'
              : 'Completa el formulario para crear un nuevo contacto.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del contacto" {...field} />
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
                    <Input placeholder="Cargo del contacto" {...field} />
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
                    <Input 
                      type="email" 
                      placeholder="correo@ejemplo.com" 
                      {...field} 
                    />
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
                    <Input placeholder="987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactoTransporteFormDialog;
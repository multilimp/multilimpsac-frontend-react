import { useState, useEffect } from "react";
import { TransportContact } from "../../../transport/models/transport.model";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ContactoTransporteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TransportContact>) => Promise<void>;
  contacto?: TransportContact | null;
  isLoading?: boolean;
}

const ContactoTransporteDialog: React.FC<ContactoTransporteDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contacto,
  isLoading = false,
}) => {
  const isEditMode = !!contacto;

  const form = useForm<Partial<TransportContact>>({
    defaultValues: {
      nombre: contacto?.nombre || "",
      cargo: contacto?.cargo || "",
      telefono: contacto?.telefono || "",
      correo: contacto?.correo || "",
      estado: contacto?.estado !== undefined ? contacto.estado : true,
    },
  });

  // Resetear el formulario cuando cambia el contacto o se abre/cierra el diálogo
  useEffect(() => {
    if (isOpen) {
      form.reset({
        nombre: contacto?.nombre || "",
        cargo: contacto?.cargo || "",
        telefono: contacto?.telefono || "",
        correo: contacto?.correo || "",
        estado: contacto?.estado !== undefined ? contacto.estado : true,
      });
    }
  }, [contacto, isOpen, form]);

  const handleSubmit = async (data: Partial<TransportContact>) => {
    try {
      await onSubmit(data);
      // El cierre del diálogo se maneja en el hook useTransportContactos
    } catch (error) {
      // Los errores se manejan en el hook useTransportContactos
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Contacto" : "Nuevo Contacto"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza los datos del contacto del transporte"
              : "Completa los datos para agregar un nuevo contacto al transporte"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="nombre"
              rules={{ required: "El nombre es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo" {...field} />
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
                    <Input placeholder="Cargo o posición" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono de contacto" {...field} />
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
                      <Input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : isEditMode ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactoTransporteDialog;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ContactoCliente } from '../models/client.model';

interface ContactoClienteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contacto?: ContactoCliente;
  clienteId: string;
  onSubmit: (data: Partial<ContactoCliente>) => Promise<void>;
  isSubmitting: boolean;
}

const ContactoClienteDialog: React.FC<ContactoClienteDialogProps> = ({
  isOpen,
  onOpenChange,
  contacto,
  clienteId,
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Partial<ContactoCliente>>({
    nombre: '',
    cargo: '',
    telefono: '',
    correo: '',
  });
  
  const isEditing = !!contacto;
  
  useEffect(() => {
    if (contacto) {
      setFormData({
        nombre: contacto.nombre || '',
        cargo: contacto.cargo || '',
        telefono: contacto.telefono || '',
        correo: contacto.correo || '',
      });
    } else {
      setFormData({
        nombre: '',
        cargo: '',
        telefono: '',
        correo: '',
        clientId: clienteId
      });
    }
  }, [contacto, clienteId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, clientId: clienteId });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Contacto' : 'Agregar Contacto'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre *
              </Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cargo" className="text-right">
                Cargo
              </Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="correo" className="text-right">
                Correo
              </Label>
              <Input
                id="correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Guardando...'
                : isEditing
                ? 'Actualizar'
                : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactoClienteDialog;

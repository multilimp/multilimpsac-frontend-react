
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TransportContact } from '../models/transportContact.model';

interface ContactosTransporteTabProps {
  contactos: TransportContact[];
  isLoading: boolean;
  onAddContacto: () => void;
  onEditContacto: (contacto: TransportContact) => void;
  onDeleteContacto: (contacto: TransportContact) => void;
}

const ContactosTransporteTab: React.FC<ContactosTransporteTabProps> = ({
  contactos,
  isLoading,
  onAddContacto,
  onEditContacto,
  onDeleteContacto
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Contactos</h2>
        <Button onClick={onAddContacto}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Contacto
        </Button>
      </div>
      
      {/* Implementar tabla de contactos aquí */}
      <div className="mt-4">
        {isLoading ? (
          <div className="text-center p-4">Cargando contactos...</div>
        ) : contactos.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No hay contactos registrados para este transporte.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-2">Nombre</th>
                <th className="text-left p-2">Cargo</th>
                <th className="text-left p-2">Teléfono</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Estado</th>
                <th className="text-right p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((contacto) => (
                <tr key={contacto.id} className="border-b">
                  <td className="p-2">{contacto.name}</td>
                  <td className="p-2">{contacto.position || '—'}</td>
                  <td className="p-2">{contacto.phone || '—'}</td>
                  <td className="p-2">{contacto.email || '—'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      contacto.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {contacto.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEditContacto(contacto)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteContacto(contacto)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ContactosTransporteTab;

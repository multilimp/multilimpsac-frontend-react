
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Phone, User } from 'lucide-react';

const ContactCard = ({ name, role, email, phone }: { name: string; role: string; email: string; phone: string }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{phone}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ClientContactsPage = () => {
  const contacts = [
    { name: "Juan Pérez", role: "Gerente de Compras", email: "juan.perez@ejemplo.com", phone: "+51 987654321" },
    { name: "María López", role: "Coordinadora de Operaciones", email: "maria.lopez@ejemplo.com", phone: "+51 987654322" },
    { name: "Carlos Rodriguez", role: "Asistente Administrativo", email: "carlos.rodriguez@ejemplo.com", phone: "+51 987654323" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Contactos</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Contacto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact, index) => (
          <ContactCard key={index} {...contact} />
        ))}
      </div>
    </div>
  );
};

export default ClientContactsPage;

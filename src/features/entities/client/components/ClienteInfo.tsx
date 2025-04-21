
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cliente } from '../models/client.model';

interface ClienteInfoProps {
  cliente: Cliente;
}

const ClienteInfo: React.FC<ClienteInfoProps> = ({ cliente }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Razón Social</p>
            <p>{cliente.razonSocial}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">RUC</p>
            <p>{cliente.ruc}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Código de Unidad</p>
            <p>{cliente.codUnidad}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Dirección</p>
            <p>{cliente.direccion || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ubicación</p>
            <p>
              {[
                cliente.departamento,
                cliente.provincia,
                cliente.distrito
              ].filter(Boolean).join(', ') || '—'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <p>{cliente.estado ? 'Activo' : 'Inactivo'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClienteInfo;

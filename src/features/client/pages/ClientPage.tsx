
import React from "react";
import { useClients } from "../services/client.service";
import { Client } from "../models/client.model";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { LoadingFallback } from "@/components/common/LoadingFallback";
import PageHeader from "@/components/common/PageHeader";

const ClientPage: React.FC = () => {
  const { data: clients, isLoading, error } = useClients();

  if (isLoading) return <LoadingFallback />;
  
  if (error) return (
    <div className="p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="container py-6">
      <PageHeader 
        title="Clientes" 
        description="Gestión de clientes de la empresa"
      />
      
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients && clients.length > 0 ? (
              clients.map((client: Client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.ruc}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientPage;


import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TableActions from "@/components/common/TableActions";
import TableEmptyState from "@/components/common/TableEmptyState";
import { Cliente } from "../models/client.model";

interface ClienteTableProps {
  clientes: Cliente[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export const ClienteTable: React.FC<ClienteTableProps> = ({
  clientes,
  isLoading = false,
  onDelete,
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando clientes...</div>
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <TableEmptyState 
        title="No se encontraron clientes" 
        description="No hay clientes registrados en el sistema."
        action={
          <Button onClick={() => navigate("/clientes/nuevo")}>
            Crear nuevo cliente
          </Button>
        }
      />
    );
  }

  const handleView = (cliente: Cliente) => {
    navigate(`/clientes/${cliente.id}`);
  };

  const handleEdit = (cliente: Cliente) => {
    navigate(`/clientes/${cliente.id}/editar`);
  };

  const handleDeleteAction = (cliente: Cliente) => {
    if (onDelete) onDelete(cliente.id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RUC</TableHead>
            <TableHead>Razón Social</TableHead>
            <TableHead>Código Unidad</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>{cliente.ruc}</TableCell>
              <TableCell>{cliente.razonSocial}</TableCell>
              <TableCell>{cliente.codUnidad}</TableCell>
              <TableCell>{cliente.direccion || '—'}</TableCell>
              <TableCell>
                <Badge variant={cliente.estado ? "default" : "destructive"}>
                  {cliente.estado ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <TableActions
                  row={cliente}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteAction}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

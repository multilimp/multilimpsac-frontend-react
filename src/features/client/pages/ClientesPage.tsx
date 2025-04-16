
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import { ClienteTable } from "../components/ClienteTable";
import { useClientes, useDeleteCliente } from "../services/cliente.service";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ClientesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null);
  
  // Consulta React Query para obtener clientes
  const { data: clientes = [], isLoading } = useClientes();
  
  // Mutación para eliminar clientes
  const { mutate: deleteCliente, isPending: isDeleting } = useDeleteCliente();

  // Filtrar clientes basado en término de búsqueda
  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.ruc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.codUnidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleDelete = (id: string) => {
    setClienteToDelete(id);
  };

  const confirmDelete = () => {
    if (clienteToDelete) {
      deleteCliente(clienteToDelete, {
        onSuccess: () => {
          toast({
            title: "Cliente eliminado",
            description: "El cliente ha sido eliminado exitosamente.",
          });
          setClienteToDelete(null);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar",
            description: error.message || "No se pudo eliminar el cliente.",
          });
        },
      });
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <PageHeader 
          title="Clientes" 
          description="Gestiona los clientes de la empresa."
        />
        
        <div className="flex justify-between items-center">
          <div className="w-1/3">
            <SearchBar 
              placeholder="Buscar por razón social, RUC o código" 
              onChange={handleSearchChange}
            />
          </div>
          <Button onClick={() => navigate("/clientes/nuevo")}>
            Nuevo Cliente
          </Button>
        </div>
        
        <ClienteTable 
          clientes={filteredClientes} 
          isLoading={isLoading} 
          onDelete={handleDelete}
        />
      </div>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={!!clienteToDelete} onOpenChange={(open) => !open && setClienteToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClienteToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

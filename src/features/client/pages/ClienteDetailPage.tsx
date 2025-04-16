import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Edit, Phone } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  useCliente, 
  useContactosCliente, 
  useCreateContactoCliente, 
  useUpdateContactoCliente, 
  useDeleteContactoCliente 
} from "../services/cliente.service";
import { ContactosClienteTable } from "../components/ContactosClienteTable";
import { ContactoClienteForm } from "../components/ContactoClienteForm";
import { ContactoCliente } from "../models/client.model";
import { useToast } from "@/hooks/use-toast";

export const ClienteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados para gestionar diálogos
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactoToEdit, setContactoToEdit] = useState<ContactoCliente | null>(null);
  const [contactoToDelete, setContactoToDelete] = useState<string | null>(null);
  
  // Consultas React Query
  const { data: cliente, isLoading: isLoadingCliente, error: clienteError } = useCliente(id as string);
  const { data: contactos = [], isLoading: isLoadingContactos } = useContactosCliente(id as string);
  
  // Mutaciones para contactos
  const { mutate: createContacto, isPending: isCreatingContacto } = useCreateContactoCliente();
  const { mutate: updateContacto, isPending: isUpdatingContacto } = useUpdateContactoCliente();
  const { mutate: deleteContacto, isPending: isDeletingContacto } = useDeleteContactoCliente();
  
  const handleCreateContacto = (data: Partial<ContactoCliente>) => {
    createContacto(
      { ...data, clienteId: id as string },
      {
        onSuccess: () => {
          toast({
            title: "Contacto creado",
            description: "El contacto ha sido creado exitosamente."
          });
          setIsContactDialogOpen(false);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al crear contacto",
            description: error.message || "No se pudo crear el contacto."
          });
        }
      }
    );
  };

  const handleUpdateContacto = (data: Partial<ContactoCliente>) => {
    if (!data.id) return;
    
    updateContacto(
      { ...data },
      {
        onSuccess: () => {
          toast({
            title: "Contacto actualizado",
            description: "El contacto ha sido actualizado exitosamente."
          });
          setContactoToEdit(null);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al actualizar contacto",
            description: error.message || "No se pudo actualizar el contacto."
          });
        }
      }
    );
  };

  const confirmDeleteContacto = () => {
    if (!contactoToDelete) return;
    
    deleteContacto(
      contactoToDelete,
      {
        onSuccess: () => {
          toast({
            title: "Contacto eliminado",
            description: "El contacto ha sido eliminado exitosamente."
          });
          setContactoToDelete(null);
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error al eliminar contacto",
            description: error.message || "No se pudo eliminar el contacto."
          });
        }
      }
    );
  };
  
  if (isLoadingCliente) {
    return (
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="Detalle de Cliente"
          description="Cargando datos del cliente..."
          backButton={{
            label: "Volver a clientes",
            onClick: () => navigate("/clientes"),
          }}
        />
        <div className="animate-pulse h-64"></div>
      </div>
    );
  }

  if (clienteError || !cliente) {
    return (
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="Detalle de Cliente"
          description="Ocurrió un error al cargar los datos del cliente"
          backButton={{
            label: "Volver a clientes",
            onClick: () => navigate("/clientes"),
          }}
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {clienteError?.message || "No se pudo cargar la información del cliente. Intente nuevamente."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-6">
        <PageHeader
          title={cliente.razonSocial}
          description={`RUC: ${cliente.ruc} | Código: ${cliente.codUnidad}`}
          backButton={{
            label: "Volver a clientes",
            onClick: () => navigate("/clientes"),
          }}
          actions={
            <Button 
              variant="outline" 
              onClick={() => navigate(`/clientes/${id}/editar`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Cliente
            </Button>
          }
        />
        
        <Tabs defaultValue="informacion">
          <TabsList>
            <TabsTrigger value="informacion">Información General</TabsTrigger>
            <TabsTrigger value="contactos">Contactos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informacion" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Datos del Cliente</span>
                  <Badge variant={cliente.estado ? "success" : "destructive"}>
                    {cliente.estado ? "Activo" : "Inactivo"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">RUC</h4>
                    <p className="text-lg">{cliente.ruc}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Razón Social</h4>
                    <p className="text-lg">{cliente.razonSocial}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Código de Unidad</h4>
                    <p className="text-lg">{cliente.codUnidad}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Ubicación</h4>
                    <p className="text-lg">
                      {cliente.departamento ? `${cliente.departamento}, ` : ''}
                      {cliente.provincia ? `${cliente.provincia}, ` : ''}
                      {cliente.distrito || '—'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Dirección</h4>
                    <p className="text-lg">{cliente.direccion || '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contactos" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Contactos del Cliente</h3>
              <Button onClick={() => setIsContactDialogOpen(true)}>
                <Phone className="h-4 w-4 mr-2" />
                Nuevo Contacto
              </Button>
            </div>
            
            <ContactosClienteTable 
              contactos={contactos}
              isLoading={isLoadingContactos}
              onEdit={(contacto) => setContactoToEdit(contacto)}
              onDelete={(id) => setContactoToDelete(id)}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Diálogo para crear/editar contacto */}
      <Dialog 
        open={isContactDialogOpen || !!contactoToEdit} 
        onOpenChange={(open) => {
          if (!open) {
            setIsContactDialogOpen(false);
            setContactoToEdit(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {contactoToEdit ? 'Editar Contacto' : 'Nuevo Contacto'}
            </DialogTitle>
            <DialogDescription>
              {contactoToEdit 
                ? 'Actualiza los datos del contacto del cliente.'
                : 'Agrega un nuevo contacto para este cliente.'}
            </DialogDescription>
          </DialogHeader>
          
          <ContactoClienteForm
            clienteId={id as string}
            initialData={contactoToEdit || {}}
            onSubmit={contactoToEdit ? handleUpdateContacto : handleCreateContacto}
            isSubmitting={isCreatingContacto || isUpdatingContacto}
            onCancel={() => {
              setIsContactDialogOpen(false);
              setContactoToEdit(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para confirmar eliminación de contacto */}
      <Dialog 
        open={!!contactoToDelete} 
        onOpenChange={(open) => !open && setContactoToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactoToDelete(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteContacto} 
              disabled={isDeletingContacto}
            >
              {isDeletingContacto ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
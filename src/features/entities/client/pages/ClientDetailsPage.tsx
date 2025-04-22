import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Pencil, Plus } from 'lucide-react';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { useToast } from '@/hooks/use-toast';
import { useCliente, useDeleteClient } from '../services/cliente.service';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClienteContactos } from '../hooks/useClienteContactos';
import ContactoClienteDialog from '../components/ContactoClienteDialog';
import DeleteContactoDialog from '../components/DeleteContactoDialog';

const ClientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: cliente, isLoading: isLoadingCliente, error: clienteError } = useCliente(id || '');
  const deleteMutation = useDeleteClient();
  
  const {
    contactos,
    isLoadingContactos,
    isContactoDialogOpen,
    setIsContactoDialogOpen,
    isDeleteDialogOpen: isDeleteContactoDialogOpen,
    setIsDeleteDialogOpen: setIsDeleteContactoDialogOpen,
    selectedContacto,
    isCreatingContacto,
    isUpdatingContacto,
    isDeletingContacto,
    handleOpenAddContactoDialog,
    handleOpenEditContactoDialog,
    handleOpenDeleteContactoDialog,
    handleContactoSubmit,
    handleDeleteContacto
  } = useClienteContactos(id);
  
  const breadcrumbItems = [
    {
      label: "Clientes",
      path: "/clientes",
    },
    {
      label: cliente?.razonSocial || "Detalle",
      path: `/clientes/${id}`,
      isCurrentPage: true
    }
  ];
  
  const handleBackClick = () => {
    navigate('/clientes');
  };
  
  const handleEditClick = () => {
    navigate(`/clientes/${id}/edit`);
  };
  
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id || '');
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente"
      });
      navigate('/clientes');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el cliente: ${error.message}`
      });
    }
  };
  
  // Render loading state
  if (isLoadingCliente) {
    return <LoadingFallback />;
  }
  
  // Render error state
  if (clienteError || !cliente) {
    return (
      <div className="p-4">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {(clienteError as Error)?.message || "No se pudo cargar el cliente"}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Clientes
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Clientes
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6 text-muted-foreground" />
            {cliente.razonSocial}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Eliminar
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="contacts">Contactos</TabsTrigger>
          <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
          <TabsTrigger value="facturas">Facturas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Razón Social</p>
                    <p className="font-medium">{cliente.razonSocial}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">RUC</p>
                    <p>{cliente.ruc}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Código de Unidad</p>
                    <p>{cliente.codUnidad}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Estado</p>
                    <p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cliente.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cliente.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Dirección</p>
                    <p>{cliente.direccion || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Departamento</p>
                    <p>{cliente.departamento || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Provincia</p>
                    <p>{cliente.provincia || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Distrito</p>
                    <p>{cliente.distrito || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="mr-2 h-5 w-5 text-muted-foreground" />
              Contactos
            </h2>
            <Button onClick={handleOpenAddContactoDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Contacto
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-4">
              {isLoadingContactos ? (
                <p className="text-center">Cargando contactos...</p>
              ) : contactos.length > 0 ? (
                <div className="grid gap-4">
                  {contactos.map(contacto => (
                    <div key={contacto.id} className="border p-4 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium">{contacto.nombre}</p>
                        <p className="text-sm text-gray-500">{contacto.cargo}</p>
                        <div className="flex space-x-4 mt-1 text-sm">
                          {contacto.telefono && <p>{contacto.telefono}</p>}
                          {contacto.correo && <p>{contacto.correo}</p>}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEditContactoDialog(contacto)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteContactoDialog(contacto)}>
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay contactos asociados a este cliente.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ordenes">
          <Card>
            <CardHeader>
              <CardTitle>Órdenes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Listado de órdenes del cliente...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facturas">
          <Card>
            <CardHeader>
              <CardTitle>Facturas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Listado de facturas del cliente...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente
              y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <ContactoClienteDialog 
        isOpen={isContactoDialogOpen}
        onOpenChange={setIsContactoDialogOpen}
        contacto={selectedContacto}
        clienteId={id || ''}
        onSubmit={handleContactoSubmit}
        isSubmitting={isCreatingContacto || isUpdatingContacto}
      />
      
      <DeleteContactoDialog 
        isOpen={isDeleteContactoDialogOpen}
        onOpenChange={setIsDeleteContactoDialogOpen}
        onConfirm={handleDeleteContacto}
        isDeleting={isDeletingContacto}
      />
    </div>
  );
};

export default ClientDetailsPage;
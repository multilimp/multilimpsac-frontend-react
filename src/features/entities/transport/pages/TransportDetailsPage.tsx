
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransport, useDeleteTransport } from '../services/transport.service';
import { useTransportContacts } from '../hooks/useTransportContacts';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ContactosTransporteTab } from '../components/ContactosTransporteTab';
import DeleteContactoDialog from '../components/ContactoTransporteDeleteDialog';
import ContactoTransporteDialog from '../components/ContactoTransporteDialog';

const TransportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const {
    data: transport,
    isLoading,
    error
  } = useTransport(id as string);
  
  const {
    contactos,
    isLoadingContactos,
    isContactoDialogOpen,
    setIsContactoDialogOpen,
    isDeleteDialogOpen: isContactoDeleteDialogOpen,
    setIsDeleteDialogOpen: setIsContactoDeleteDialogOpen,
    selectedContacto,
    isCreatingContacto,
    isUpdatingContacto,
    isDeletingContacto,
    handleOpenAddContactoDialog,
    handleOpenEditContactoDialog,
    handleOpenDeleteContactoDialog,
    handleContactoSubmit,
    handleDeleteContacto
  } = useTransportContacts(id);
  
  const { mutateAsync: deleteTransporte, isPending: isDeleting } = useDeleteTransport();
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Cargando detalles del transporte" 
          description="Por favor espere mientras se cargan los datos..."
          backButton={{
            label: "Volver a transportes",
            onClick: () => navigate("/transportes"),
          }}
        />
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Cargando información...</div>
        </div>
      </div>
    );
  }
  
  if (error || !transport) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Error al cargar transporte" 
          description="Ocurrió un error al cargar los datos del transporte"
          backButton={{
            label: "Volver a transportes",
            onClick: () => navigate("/transportes"),
          }}
        />
        <div className="p-6 text-red-500">
          {error instanceof Error ? error.message : "No se pudo cargar la información del transporte."}
        </div>
      </div>
    );
  }
  
  const handleDeleteTransport = async () => {
    try {
      await deleteTransporte(transport.id);
      toast({
        title: "Transporte eliminado",
        description: "El transporte ha sido eliminado exitosamente.",
      });
      navigate("/transportes");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el transporte.",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title={transport.razon_social} 
        description={`RUC: ${transport.ruc}`}
        backButton={{
          label: "Volver a transportes",
          onClick: () => navigate("/transportes"),
        }}
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/transportes/${transport.id}/editar`)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente el transporte
                    {transport.razon_social} y todos sus contactos asociados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteTransport} 
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Transporte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Razón Social</p>
                  <p>{transport.razon_social}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">RUC</p>
                  <p>{transport.ruc}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <Badge variant={transport.estado ? "default" : "destructive"}>
                    {transport.estado ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <p>{transport.direccion || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Departamento</p>
                  <p>{transport.departamento || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Provincia</p>
                  <p>{transport.provincia || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Distrito</p>
                  <p>{transport.distrito || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cobertura</p>
                  <p>{transport.cobertura || '—'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <ContactosTransporteTab 
          contactos={contactos}
          isLoading={isLoadingContactos}
          onAddContacto={handleOpenAddContactoDialog}
          onEditContacto={handleOpenEditContactoDialog}
          onDeleteContacto={handleOpenDeleteContactoDialog}
        />
      </Tabs>
      
      <ContactoTransporteDialog 
        isOpen={isContactoDialogOpen}
        onOpenChange={setIsContactoDialogOpen}
        contacto={selectedContacto}
        transporteId={transport.id}
        onSubmit={handleContactoSubmit}
        isSubmitting={isCreatingContacto || isUpdatingContacto}
      />
      
      <DeleteContactoDialog
        isOpen={isContactoDeleteDialogOpen}
        onOpenChange={setIsContactoDeleteDialogOpen}
        onConfirm={handleDeleteContacto}
        contacto={selectedContacto}
        isDeleting={isDeletingContacto}
      />
    </div>
  );
};

export default TransportDetailsPage;

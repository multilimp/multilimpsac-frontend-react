
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Truck, Pencil } from 'lucide-react';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { useToast } from '@/hooks/use-toast';
import { useTransport, useDeleteTransport } from '../services/transport.service';
import { LoadingFallback } from '@/components/common/LoadingFallback';
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
import { useTransportContacts } from '../hooks/useTransportContacts';
import TransportContactsTab from '../components/TransportContactsTab';
import TransportContactDialog from '../components/TransportContactDialog';
import TransportContactDeleteDialog from '../components/TransportContactDeleteDialog';

const TransportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: transport, isLoading, error } = useTransport(id || '');
  const deleteMutation = useDeleteTransport();

  // Hook for managing transport contacts
  const {
    contacts,
    isLoadingContacts,
    isContactDialogOpen,
    setIsContactDialogOpen,
    isDeleteDialogOpen: isContactDeleteDialogOpen,
    setIsDeleteDialogOpen: setIsContactDeleteDialogOpen,
    selectedContact,
    isCreatingContact,
    isUpdatingContact,
    isDeletingContact,
    handleOpenAddContactDialog,
    handleOpenEditContactDialog,
    handleOpenDeleteContactDialog,
    handleContactSubmit,
    handleDeleteContact
  } = useTransportContacts(id);
  
  const breadcrumbItems = [
    {
      label: "Transportes",
      path: "/transportes",
    },
    {
      label: transport?.name || "Detalle",
      path: `/transportes/${id}`,
      isCurrentPage: true
    }
  ];
  
  const handleBackClick = () => {
    navigate('/transportes');
  };
  
  const handleEditClick = () => {
    navigate(`/transportes/${id}/edit`);
  };
  
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id || '');
      toast({
        title: "Transporte eliminado",
        description: "El transporte ha sido eliminado exitosamente"
      });
      navigate('/transportes');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el transporte: ${error.message}`
      });
    }
  };
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  if (error || !transport) {
    return (
      <div className="p-4">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {(error as Error)?.message || "No se pudo cargar el transporte"}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Transportes
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
            Transportes
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Truck className="mr-2 h-6 w-6 text-muted-foreground" />
            {transport.name}
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
                    <p className="font-medium">{transport.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">RUC</p>
                    <p>{transport.ruc}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Estado</p>
                    <p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        transport.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transport.status === 'active' ? 'Activo' : 'Inactivo'}
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
                    <p>{transport.address || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Departamento</p>
                    <p>{transport.department || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Provincia</p>
                    <p>{transport.province || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Distrito</p>
                    <p>{transport.district || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Cobertura</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{transport.coverage || "Sin información de cobertura"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-6">
          <TransportContactsTab 
            contacts={contacts}
            isLoading={isLoadingContacts}
            onAddContact={handleOpenAddContactDialog}
            onEditContact={handleOpenEditContactDialog}
            onDeleteContact={handleOpenDeleteContactDialog}
          />
        </TabsContent>
      </Tabs>
      
      {/* Transport delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el transporte
              {transport && ` ${transport.name}`} y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Contact dialogs */}
      <TransportContactDialog 
        isOpen={isContactDialogOpen}
        onClose={() => setIsContactDialogOpen(false)}
        contact={selectedContact}
        onSubmit={handleContactSubmit}
        isLoading={isCreatingContact || isUpdatingContact}
      />
      
      <TransportContactDeleteDialog 
        isOpen={isContactDeleteDialogOpen}
        onClose={() => setIsContactDeleteDialogOpen(false)}
        onDelete={handleDeleteContact}
        contact={selectedContact}
        isLoading={isDeletingContact}
      />
    </div>
  );
};

export default TransportDetailsPage;

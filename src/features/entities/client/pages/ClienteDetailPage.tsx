
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useCliente } from '../../../client/services/cliente.service';

import ClienteInfo from '../components/ClienteInfo';
import ClienteDetailsTabs from '../components/ClienteDetailsTabs';
import ContactosClienteTab from '../components/ContactosClienteTab';
import ClienteDetailLoading from '../components/ClienteDetailLoading';
import ClienteDetailError from '../components/ClienteDetailError';
import ContactoClienteDialog from '../components/ContactoClienteDialog';
import DeleteContactoDialog from '../components/DeleteContactoDialog';
import { useClienteContactos } from '../hooks/useClienteContactos';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ClienteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('details');
  
  const { 
    data: cliente, 
    isLoading: isLoadingCliente, 
    error: clienteError
  } = useCliente(id);
  
  const {
    contactos,
    isLoadingContactos,
    isContactoDialogOpen,
    setIsContactoDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
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
  
  // Handle tab changes and update the route
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'details') {
      navigate(`/clientes/${id}`);
    } else {
      navigate(`/clientes/${id}/${value}`);
    }
  };
  
  // Render loading state
  if (isLoadingCliente) {
    return <ClienteDetailLoading />;
  }
  
  // Render error state
  if (clienteError || !cliente) {
    return <ClienteDetailError error={clienteError} />;
  }
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title={cliente.razonSocial} 
        description={`RUC: ${cliente.ruc}`}
        backButton={{
          label: "Volver a clientes",
          onClick: () => navigate("/clientes"),
        }}
        actions={
          <Button variant="outline" onClick={() => navigate(`/clientes/${id}/editar`)}>
            Editar Cliente
          </Button>
        }
      />
      
      <ClienteInfo cliente={cliente} />
      
      <ClienteDetailsTabs activeTab={activeTab} onTabChange={handleTabChange}>
        <ContactosClienteTab 
          contactos={contactos}
          isLoading={isLoadingContactos}
          onAddContacto={handleOpenAddContactoDialog}
          onEditContacto={handleOpenEditContactoDialog}
          onDeleteContacto={handleOpenDeleteContactoDialog}
        />
        
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
      </ClienteDetailsTabs>
      
      <ContactoClienteDialog 
        isOpen={isContactoDialogOpen}
        onOpenChange={setIsContactoDialogOpen}
        contacto={selectedContacto}
        clienteId={id || ''}
        onSubmit={handleContactoSubmit}
        isSubmitting={isCreatingContacto || isUpdatingContacto}
      />
      
      <DeleteContactoDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteContacto}
        isDeleting={isDeletingContacto}
      />
    </div>
  );
};

export default ClienteDetailPage;

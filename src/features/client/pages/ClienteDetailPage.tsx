
import React from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import { useCliente, useDeleteContactoCliente, useContactosCliente, useCreateContactoCliente, useUpdateContactoCliente } from '../services/cliente.service';
import { ContactoClienteTable } from '../components/ContactosClienteTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContactoCliente } from '../models/client.model';

// Create a simple ContactoClienteForm component
const ContactoClienteForm = ({ onSubmit, initialData = {}, isSubmitting }) => {
  // This is a placeholder for the actual form
  return (
    <div>
      <h3>Form placeholder</h3>
      <Button onClick={() => onSubmit(initialData)} disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </Button>
    </div>
  );
};

const ClienteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = React.useState('details');
  const [isContactoDialogOpen, setIsContactoDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedContacto, setSelectedContacto] = React.useState<ContactoCliente | null>(null);
  
  // Fetch cliente data
  const { 
    data: cliente, 
    isLoading: isLoadingCliente, 
    error: clienteError,
    refetch: refetchCliente
  } = useCliente(id);
  
  // Fetch contactos data
  const {
    data: contactos = [],
    isLoading: isLoadingContactos,
    refetch: refetchContactos
  } = useContactosCliente(id);
  
  // Mutations for contactos
  const { mutateAsync: createContacto, isPending: isCreatingContacto } = useCreateContactoCliente();
  const { mutateAsync: updateContacto, isPending: isUpdatingContacto } = useUpdateContactoCliente();
  const { mutateAsync: deleteContacto, isPending: isDeletingContacto } = useDeleteContactoCliente(id);
  
  // Handle tab changes to navigate to the appropriate route
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'details') {
      navigate(`/clientes/${id}`);
    } else {
      navigate(`/clientes/${id}/${value}`);
    }
  };
  
  if (isLoadingCliente) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Cargando detalles del cliente" 
          description="Por favor espere mientras se cargan los datos..."
          backButton={{
            label: "Volver a clientes",
            onClick: () => navigate("/clientes"),
          }}
        />
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Cargando información...</div>
        </div>
      </div>
    );
  }
  
  if (clienteError || !cliente) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Error al cargar cliente" 
          description="Ocurrió un error al cargar los datos del cliente"
          backButton={{
            label: "Volver a clientes",
            onClick: () => navigate("/clientes"),
          }}
        />
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {clienteError?.message || "No se pudo cargar la información del cliente."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Handle form submission for contactos
  const handleContactoSubmit = async (data: Partial<ContactoCliente>) => {
    try {
      if (selectedContacto) {
        // Update existing contacto
        await updateContacto({
          id: selectedContacto.id,
          data: {
            ...data,
            clienteId: id
          }
        });
        toast({
          title: "Contacto actualizado",
          description: "El contacto ha sido actualizado exitosamente.",
          variant: "default"
        });
      } else {
        // Create new contacto
        await createContacto({
          ...data,
          clienteId: id
        });
        toast({
          title: "Contacto creado",
          description: "El contacto ha sido creado exitosamente.",
          variant: "default"
        });
      }
      
      refetchContactos();
      setIsContactoDialogOpen(false);
      setSelectedContacto(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al guardar el contacto.",
        variant: "destructive"
      });
    }
  };
  
  // Handle contacto deletion
  const handleDeleteContacto = async () => {
    if (!selectedContacto) return;
    
    try {
      await deleteContacto(selectedContacto.id);
      toast({
        title: "Contacto eliminado",
        description: "El contacto ha sido eliminado exitosamente.",
        variant: "default"
      });
      refetchContactos();
      setIsDeleteDialogOpen(false);
      setSelectedContacto(null);
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el contacto.",
        variant: "destructive"
      });
    }
  };
  
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
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="contactos">Contactos</TabsTrigger>
          <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
          <TabsTrigger value="facturas">Facturas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Información adicional del cliente...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contactos">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contactos</h2>
            <Button onClick={() => {
              setSelectedContacto(null);
              setIsContactoDialogOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Contacto
            </Button>
          </div>
          
          <ContactosClienteTable 
            contactos={contactos}
            isLoading={isLoadingContactos}
            onEdit={(contacto) => {
              setSelectedContacto(contacto);
              setIsContactoDialogOpen(true);
            }}
            onDelete={(contacto) => {
              setSelectedContacto(contacto);
              setIsDeleteDialogOpen(true);
            }}
          />
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
      
      {/* Dialog para crear/editar contactos */}
      <Dialog open={isContactoDialogOpen} onOpenChange={setIsContactoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedContacto ? 'Editar Contacto' : 'Nuevo Contacto'}
            </DialogTitle>
            <DialogDescription>
              {selectedContacto 
                ? 'Actualice los datos del contacto'
                : 'Complete los datos para agregar un nuevo contacto'}
            </DialogDescription>
          </DialogHeader>
          <ContactoClienteForm 
            initialData={selectedContacto || { clienteId: id }}
            onSubmit={handleContactoSubmit}
            isSubmitting={isCreatingContacto || isUpdatingContacto}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog para confirmar eliminación de contacto */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteContacto} disabled={isDeletingContacto}>
              {isDeletingContacto ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClienteDetailPage;

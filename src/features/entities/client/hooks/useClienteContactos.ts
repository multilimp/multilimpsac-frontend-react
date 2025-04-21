import { useState } from 'react';
import { ClientContact } from '../models/client.model';
import { useToast } from '@/hooks/use-toast';
import { 
  useDeleteContactoCliente, 
  useContactosCliente, 
  useCreateContactoCliente, 
  useUpdateContactoCliente 
} from '../../../client/services/cliente.service';

export const useClienteContactos = (clienteId: string | undefined) => {
  const { toast } = useToast();
  const [isContactoDialogOpen, setIsContactoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState<ClientContact | null>(null);
  
  const {
    data: contactos = [],
    isLoading: isLoadingContactos,
    refetch: refetchContactos
  } = useContactosCliente(clienteId);
  
  const { mutateAsync: createContacto, isPending: isCreatingContacto } = useCreateContactoCliente();
  const { mutateAsync: updateContacto, isPending: isUpdatingContacto } = useUpdateContactoCliente();
  const { mutateAsync: deleteContacto, isPending: isDeletingContacto } = useDeleteContactoCliente(clienteId);
  
  const handleOpenAddContactoDialog = () => {
    setSelectedContacto(null);
    setIsContactoDialogOpen(true);
  };
  
  const handleOpenEditContactoDialog = (contacto: ClientContact) => {
    setSelectedContacto(contacto);
    setIsContactoDialogOpen(true);
  };
  
  const handleOpenDeleteContactoDialog = (contacto: ClientContact) => {
    setSelectedContacto(contacto);
    setIsDeleteDialogOpen(true);
  };
  
  const handleContactoSubmit = async (data: Partial<ClientContact>) => {
    try {
      if (selectedContacto) {
        await updateContacto({
          id: selectedContacto.id,
          data: {
            ...data,
            clientId: clienteId
          }
        });
        toast({
          title: "Contacto actualizado",
          description: "El contacto ha sido actualizado exitosamente.",
          variant: "default"
        });
      } else {
        await createContacto({
          ...data,
          clientId: clienteId
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al guardar el contacto.",
        variant: "destructive"
      });
    }
  };
  
  return {
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
    handleDeleteContacto: async () => {
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
      } catch (error: any) {
        toast({
          title: "Error al eliminar",
          description: error.message || "No se pudo eliminar el contacto.",
          variant: "destructive"
        });
      }
    }
  };
};

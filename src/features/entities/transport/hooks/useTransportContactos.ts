import { useState } from 'react';
import { TransportContact } from '../../../transport/models/transport.model';
import { useToast } from '@/hooks/use-toast';
import { 
  useTransportContacts, 
  useCreateTransportContact, 
  useUpdateTransportContact, 
  useDeleteTransportContact 
} from '../services/transport.service';

export const useTransportContactos = (transportId: string | undefined) => {
  const { toast } = useToast();
  const [isContactoDialogOpen, setIsContactoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState<TransportContact | null>(null);
  
  const {
    data: contactos = [],
    isLoading: isLoadingContactos,
    refetch: refetchContactos
  } = useTransportContacts(transportId);
  
  const { mutateAsync: createContacto, isPending: isCreatingContacto } = useCreateTransportContact();
  const { mutateAsync: updateContacto, isPending: isUpdatingContacto } = useUpdateTransportContact();
  const { mutateAsync: deleteContacto, isPending: isDeletingContacto } = useDeleteTransportContact(transportId);
  
  const handleOpenAddContactoDialog = () => {
    setSelectedContacto(null);
    setIsContactoDialogOpen(true);
  };
  
  const handleOpenEditContactoDialog = (contacto: TransportContact) => {
    setSelectedContacto(contacto);
    setIsContactoDialogOpen(true);
  };
  
  const handleOpenDeleteContactoDialog = (contacto: TransportContact) => {
    setSelectedContacto(contacto);
    setIsDeleteDialogOpen(true);
  };
  
  const handleContactoSubmit = async (data: Partial<TransportContact>) => {
    try {
      if (selectedContacto) {
        await updateContacto({
          id: selectedContacto.id,
          data: {
            ...data,
            transportId
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
          transportId
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
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el contacto.",
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
    handleDeleteContacto
  };
};
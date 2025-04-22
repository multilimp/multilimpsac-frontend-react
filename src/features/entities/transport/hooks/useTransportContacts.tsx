
import { useState } from 'react';
import { TransportContact } from '../models/transport.model';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getTransportContacts,
  createTransportContact,
  updateTransportContact,
  deleteTransportContact
} from '../services/transport-contact.service';

export const useTransportContacts = (transportId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isContactoDialogOpen, setIsContactoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState<TransportContact | null>(null);
  
  // Query to fetch contacts
  const { 
    data: contactos = [], 
    isLoading: isLoadingContactos,
    refetch
  } = useQuery({
    queryKey: ['transportContacts', transportId],
    queryFn: () => getTransportContacts(transportId as string),
    enabled: !!transportId
  });
  
  // Mutation to create a new contact
  const createContactMutation = useMutation({
    mutationFn: (contacto: Omit<TransportContact, 'id'>) => 
      createTransportContact(contacto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportContacts', transportId] });
    }
  });
  
  // Mutation to update an existing contact
  const updateContactMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<TransportContact> }) => 
      updateTransportContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportContacts', transportId] });
    }
  });
  
  // Mutation to delete a contact
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => deleteTransportContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportContacts', transportId] });
    }
  });
  
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
        // Update existing contact
        await updateContactMutation.mutateAsync({
          id: selectedContacto.id,
          data: {
            ...data,
            transporte_id: transportId
          }
        });
        toast({
          title: "Contacto actualizado",
          description: "El contacto ha sido actualizado exitosamente."
        });
      } else {
        // Create new contact
        await createContactMutation.mutateAsync({
          ...data,
          nombre: data.nombre || '',
          estado: data.estado !== undefined ? data.estado : true,
          transporte_id: transportId
        } as Omit<TransportContact, 'id'>);
        toast({
          title: "Contacto creado",
          description: "El contacto ha sido creado exitosamente."
        });
      }
      
      setIsContactoDialogOpen(false);
      setSelectedContacto(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ocurrió un error al guardar el contacto."
      });
    }
  };
  
  const handleDeleteContacto = async () => {
    if (!selectedContacto) return;
    
    try {
      await deleteContactMutation.mutateAsync(selectedContacto.id);
      toast({
        title: "Contacto eliminado",
        description: "El contacto ha sido eliminado exitosamente."
      });
      setIsDeleteDialogOpen(false);
      setSelectedContacto(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el contacto."
      });
    }
  };
  
  return {
    contactos,
    isLoadingContactos,
    refetchContactos: refetch,
    isContactoDialogOpen,
    setIsContactoDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedContacto,
    isCreatingContacto: createContactMutation.isPending,
    isUpdatingContacto: updateContactMutation.isPending,
    isDeletingContacto: deleteContactMutation.isPending,
    handleOpenAddContactoDialog,
    handleOpenEditContactoDialog,
    handleOpenDeleteContactoDialog,
    handleContactoSubmit,
    handleDeleteContacto
  };
};

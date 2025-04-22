import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { clientService } from '../services/client.service';
import { ClientContact } from '../models/client.model';

export const useClienteContactos = (clientId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isContactoDialogOpen, setIsContactoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState<ClientContact | undefined>(undefined);
  
  const { data: contactos = [], isLoading: isLoadingContactos } = useQuery({
    queryKey: ['clientContacts', clientId],
    queryFn: () => clientId ? clientService.fetchClientContacts(clientId) : [],
    enabled: !!clientId,
  });
  
  const createContactMutation = useMutation({
    mutationFn: clientService.createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientContacts', clientId] });
      toast({
        title: 'Contacto creado',
        description: 'El contacto ha sido creado exitosamente'
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `No se pudo crear el contacto: ${error.message}`
      });
    },
  });
  
  const updateContactMutation = useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: Partial<ClientContact> }) => 
      clientService.updateContact(id, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientContacts', clientId] });
      toast({
        title: 'Contacto actualizado',
        description: 'El contacto ha sido actualizado exitosamente'
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `No se pudo actualizar el contacto: ${error.message}`
      });
    },
  });
  
  const deleteContactMutation = useMutation({
    mutationFn: clientService.deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientContacts', clientId] });
      toast({
        title: 'Contacto eliminado',
        description: 'El contacto ha sido eliminado exitosamente'
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `No se pudo eliminar el contacto: ${error.message}`
      });
    },
  });
  
  const handleOpenAddContactoDialog = () => {
    setSelectedContacto(undefined);
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
    if (selectedContacto?.id) {
      await updateContactMutation.mutateAsync({
        id: selectedContacto.id,
        contact: data
      });
    } else {
      await createContactMutation.mutateAsync(data as Omit<ClientContact, 'id'>);
    }
  };
  
  const handleDeleteContacto = async () => {
    if (selectedContacto?.id) {
      await deleteContactMutation.mutateAsync(selectedContacto.id);
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
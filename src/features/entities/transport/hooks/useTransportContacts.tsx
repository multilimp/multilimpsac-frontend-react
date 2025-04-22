import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TransportContact } from '../../../transport/models/transport.model';
import { 
  useTransportContacts as useTransportContactsQuery, 
  useCreateTransportContact, 
  useUpdateTransportContact,
  useDeleteTransportContact 
} from '../services/transport.service';

export const useTransportContacts = (transportId?: string) => {
  const { toast } = useToast();
  
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<TransportContact | undefined>(undefined);
  
  const { 
    data: contacts = [], 
    isLoading: isLoadingContacts,
    refetch: refetchContacts
  } = useTransportContactsQuery(transportId);
  
  const createContactMutation = useCreateTransportContact();
  const updateContactMutation = useUpdateTransportContact();
  const deleteContactMutation = useDeleteTransportContact(transportId);
  
  const handleOpenAddContactDialog = () => {
    setSelectedContact(undefined);
    setIsContactDialogOpen(true);
  };
  
  const handleOpenEditContactDialog = (contact: TransportContact) => {
    setSelectedContact(contact);
    setIsContactDialogOpen(true);
  };
  
  const handleOpenDeleteContactDialog = (contact: TransportContact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };
  
  const handleContactSubmit = async (data: Partial<TransportContact>) => {
    try {
      if (selectedContact?.id) {
        await updateContactMutation.mutateAsync({
          id: selectedContact.id,
          data: {
            ...data,
            transportId
          }
        });
      } else {
        await createContactMutation.mutateAsync({
          ...data,
          transportId,
          estado: true
        });
      }
      
      refetchContacts();
      setIsContactDialogOpen(false);
      setSelectedContact(undefined);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ocurrió un error al guardar el contacto"
      });
    }
  };
  
  const handleDeleteContact = async () => {
    if (!selectedContact?.id) return;
    
    try {
      await deleteContactMutation.mutateAsync(selectedContact.id);
      refetchContacts();
      setIsDeleteDialogOpen(false);
      setSelectedContact(undefined);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Ocurrió un error al eliminar el contacto"
      });
    }
  };
  
  return {
    contacts,
    isLoadingContacts,
    isContactDialogOpen,
    setIsContactDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedContact,
    isCreatingContact: createContactMutation.isPending,
    isUpdatingContact: updateContactMutation.isPending,
    isDeletingContact: deleteContactMutation.isPending,
    handleOpenAddContactDialog,
    handleOpenEditContactDialog,
    handleOpenDeleteContactDialog,
    handleContactSubmit,
    handleDeleteContact
  };
};
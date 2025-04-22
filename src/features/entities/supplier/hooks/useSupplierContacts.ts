
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { SupplierContact } from '../models/supplierContact.model';
import { 
  useSupplierContacts as useSupplierContactsQuery,
  useCreateSupplierContact, 
  useUpdateSupplierContact,
  useDeleteSupplierContact 
} from '../services/supplier-contact.service';

export const useSupplierContacts = (supplierId?: string) => {
  const { toast } = useToast();
  
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<SupplierContact | null>(null);
  
  const { 
    data: contacts = [], 
    isLoading: isLoadingContacts,
    refetch: refetchContacts
  } = useSupplierContactsQuery(supplierId);
  
  const createContactMutation = useCreateSupplierContact();
  const updateContactMutation = useUpdateSupplierContact();
  const deleteContactMutation = useDeleteSupplierContact(supplierId);
  
  const handleOpenAddContactDialog = () => {
    setSelectedContact(null);
    setIsContactDialogOpen(true);
  };
  
  const handleOpenEditContactDialog = (contact: SupplierContact) => {
    setSelectedContact(contact);
    setIsContactDialogOpen(true);
  };
  
  const handleOpenDeleteContactDialog = (contact: SupplierContact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };
  
  const handleContactSubmit = async (data: Partial<SupplierContact>) => {
    try {
      if (selectedContact?.id) {
        await updateContactMutation.mutateAsync({
          id: selectedContact.id,
          data: {
            ...data,
            supplierId
          }
        });
        toast({
          title: "Contacto actualizado",
          description: "El contacto ha sido actualizado exitosamente."
        });
      } else {
        await createContactMutation.mutateAsync({
          ...data,
          supplierId,
          status: 'active'
        });
        toast({
          title: "Contacto creado",
          description: "El contacto ha sido creado exitosamente."
        });
      }
      
      refetchContacts();
      setIsContactDialogOpen(false);
      setSelectedContact(null);
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
      toast({
        title: "Contacto eliminado",
        description: "El contacto ha sido eliminado exitosamente."
      });
      refetchContacts();
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
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


import { useState } from 'react';
import { TransportContact } from '../models/transport.model';
import { 
  useTransportContacts, 
  useCreateTransportContact, 
  useUpdateTransportContact, 
  useDeleteTransportContact 
} from '../services/transport-contact.service';
import { useToast } from '@/hooks/use-toast';

export const useTransportContactos = (transporteId: string) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState<TransportContact | null>(null);
  
  const { 
    data: contactos = [],
    isLoading,
    refetch
  } = useTransportContacts(transporteId);
  
  const createMutation = useCreateTransportContact();
  const updateMutation = useUpdateTransportContact();
  const deleteMutation = useDeleteTransportContact();
  
  const handleAddClick = () => {
    setSelectedContacto(null);
    setIsDialogOpen(true);
  };
  
  const handleEditClick = (contacto: TransportContact) => {
    setSelectedContacto(contacto);
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (contacto: TransportContact) => {
    setSelectedContacto(contacto);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  
  const handleSubmit = async (data: Partial<TransportContact>) => {
    try {
      if (selectedContacto) {
        // Update existing contacto
        await updateMutation.mutateAsync({
          ...selectedContacto,
          ...data
        });
        toast({
          title: "Contacto actualizado",
          description: "El contacto ha sido actualizado correctamente.",
        });
      } else {
        // Create new contacto
        await createMutation.mutateAsync({
          ...data,
          transporte_id: transporteId,
          estado: true
        } as Omit<TransportContact, 'id'>);
        toast({
          title: "Contacto creado",
          description: "El contacto ha sido creado correctamente.",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error",
      });
    }
  };
  
  const handleDelete = async () => {
    if (!selectedContacto) return;
    
    try {
      await deleteMutation.mutateAsync(selectedContacto);
      toast({
        title: "Contacto eliminado",
        description: "El contacto ha sido eliminado correctamente.",
      });
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al eliminar",
      });
    }
  };
  
  return {
    contactos,
    isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    selectedContacto,
    isDialogOpen,
    isDeleteDialogOpen,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseDialog,
    handleCloseDeleteDialog,
    handleSubmit,
    handleDelete,
  };
};

export default useTransportContactos;

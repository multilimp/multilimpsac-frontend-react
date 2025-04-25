
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TransportContact } from '../models/transportContact.model';
import { supabase } from '@/config/supabase';
import { useToast } from '@/hooks/use-toast';
import { mapTransportContactFromDB, mapTransportContactToDB } from '../models/transportContact.model';

export const useTransportContacts = (transportId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedContacto, setSelectedContacto] = useState<TransportContact | null>(null);
  const [isContactoDialogOpen, setIsContactoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch contactos
  const { data: contactos = [], isLoading: isLoadingContactos } = useQuery({
    queryKey: ['transportContacts', transportId],
    queryFn: async () => {
      if (!transportId) return [];

      const { data, error } = await supabase
        .from('contacto_transportes')
        .select('*')
        .eq('transporte_id', parseInt(transportId))
        .order('nombre', { ascending: true });

      if (error) {
        throw new Error(`Error al cargar contactos: ${error.message}`);
      }

      return data.map(mapTransportContactFromDB);
    },
    enabled: !!transportId
  });

  // Create contacto
  const { mutateAsync: createContacto, isPending: isCreatingContacto } = useMutation({
    mutationFn: async (contacto: Partial<TransportContact>) => {
      if (!transportId) throw new Error('ID de transporte no válido');

      const contactoToCreate = mapTransportContactToDB({
        ...contacto,
        transportId
      });

      const { data, error } = await supabase
        .from('contacto_transportes')
        .insert(contactoToCreate)
        .select()
        .single();

      if (error) throw new Error(`Error al crear contacto: ${error.message}`);
      return mapTransportContactFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transportContacts', transportId]
      });
      toast({
        title: 'Contacto creado',
        description: 'El contacto ha sido creado exitosamente.',
      });
      setIsContactoDialogOpen(false);
    }
  });

  // Update contacto
  const { mutateAsync: updateContacto, isPending: isUpdatingContacto } = useMutation({
    mutationFn: async (contacto: Partial<TransportContact>) => {
      if (!contacto.id) throw new Error('ID de contacto no válido');

      const contactoToUpdate = mapTransportContactToDB(contacto);

      const { error } = await supabase
        .from('contacto_transportes')
        .update(contactoToUpdate)
        .eq('id', parseInt(contacto.id));

      if (error) throw new Error(`Error al actualizar contacto: ${error.message}`);
      return contacto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transportContacts', transportId]
      });
      toast({
        title: 'Contacto actualizado',
        description: 'El contacto ha sido actualizado exitosamente.',
      });
      setIsContactoDialogOpen(false);
    }
  });

  // Delete contacto
  const { mutateAsync: deleteContacto, isPending: isDeletingContacto } = useMutation({
    mutationFn: async () => {
      if (!selectedContacto?.id) throw new Error('ID de contacto no válido');

      const { error } = await supabase
        .from('contacto_transportes')
        .delete()
        .eq('id', parseInt(selectedContacto.id));

      if (error) throw new Error(`Error al eliminar contacto: ${error.message}`);
      return selectedContacto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transportContacts', transportId]
      });
      toast({
        title: 'Contacto eliminado',
        description: 'El contacto ha sido eliminado exitosamente.',
      });
      setIsDeleteDialogOpen(false);
    }
  });

  // Handler functions
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
    if (selectedContacto?.id) {
      return updateContacto({ ...data, id: selectedContacto.id });
    } else {
      return createContacto(data);
    }
  };

  const handleDeleteContacto = async () => {
    return deleteContacto();
  };

  return {
    contactos,
    isLoadingContactos,
    selectedContacto,
    isContactoDialogOpen,
    setIsContactoDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
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

import { supabase } from '@/integrations/supabase/client';
import { 
  Transport, 
  TransportDB, 
  TransportContact, 
  TransportContactDB,
  mapTransportFromDB, 
  mapTransportToDB,
  mapTransportContactFromDB,
  mapTransportContactToDB
} from '../models/transport.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default class TransportService {
  // Crear un nuevo transporte
  static async create(data: Omit<Transport, 'id'>): Promise<Transport> {
    try {
      const mappedData = mapTransportToDB(data);
      
      // Asegurar que los campos requeridos tengan valores por defecto
      const transportData = {
        razon_social: data.name || 'Nuevo transporte',
        ruc: data.ruc || '00000000000',
        direccion: data.address || 'Nueva dirección',
        cobertura: data.coverage || '',
        estado: data.status === 'active',
        departamento: data.department || '',
        provincia: data.province || '',
        distrito: data.district || ''
      };
      
      const { data: newTransport, error } = await supabase
        .from('transportes')
        .insert(transportData)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!newTransport) throw new Error('Failed to create transport');
      
      return mapTransportFromDB(newTransport as TransportDB);
    } catch (error) {
      console.error('Error creating transport:', error);
      throw error;
    }
  }
  
  // Obtener todos los transportes
  static async getAll(): Promise<Transport[]> {
    try {
      const { data, error } = await supabase
        .from('transportes')
        .select('*')
        .order('razon_social', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      return (data as TransportDB[]).map(mapTransportFromDB);
    } catch (error) {
      console.error('Error fetching transports:', error);
      throw error;
    }
  }
  
  // Obtener un transporte por ID
  static async getById(id: string): Promise<Transport> {
    try {
      const { data, error } = await supabase
        .from('transportes')
        .select('*')
        .eq('id', parseInt(id))
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Transport not found');
      
      return mapTransportFromDB(data as TransportDB);
    } catch (error) {
      console.error(`Error fetching transport with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Actualizar un transporte existente
  static async update(id: string, updates: Partial<Transport>): Promise<Transport> {
    try {
      const mappedData = mapTransportToDB(updates);
      
      const { data, error } = await supabase
        .from('transportes')
        .update(mappedData)
        .eq('id', parseInt(id))
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Transport not found');
      
      return mapTransportFromDB(data as TransportDB);
    } catch (error) {
      console.error(`Error updating transport with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Eliminar un transporte
  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('transportes')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(`Error deleting transport with ID ${id}:`, error);
      throw error;
    }
  }

  // Obtener contactos de un transporte
  static async getContactsByTransportId(transportId: string): Promise<TransportContact[]> {
    try {
      const { data, error } = await supabase
        .from('contacto_transportes')
        .select('*')
        .eq('transporte_id', parseInt(transportId))
        .order('nombre', { ascending: true });
      
      if (error) throw new Error(error.message);
      
      return (data || []).map(mapTransportContactFromDB);
    } catch (error) {
      console.error(`Error fetching contacts for transport ID ${transportId}:`, error);
      throw error;
    }
  }

  // Crear un nuevo contacto para un transporte
  static async createContact(data: Partial<TransportContact>): Promise<TransportContact> {
    try {
      const mappedData = mapTransportContactToDB(data);
      
      const { data: newContact, error } = await supabase
        .from('contacto_transportes')
        .insert(mappedData)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!newContact) throw new Error('Failed to create contact');
      
      return mapTransportContactFromDB(newContact as TransportContactDB);
    } catch (error) {
      console.error('Error creating transport contact:', error);
      throw error;
    }
  }

  // Actualizar un contacto existente
  static async updateContact(id: string, updates: Partial<TransportContact>): Promise<TransportContact> {
    try {
      const mappedData = mapTransportContactToDB(updates);
      
      const { data, error } = await supabase
        .from('contacto_transportes')
        .update(mappedData)
        .eq('id', parseInt(id))
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      if (!data) throw new Error('Contact not found');
      
      return mapTransportContactFromDB(data as TransportContactDB);
    } catch (error) {
      console.error(`Error updating contact with ID ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un contacto
  static async deleteContact(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contacto_transportes')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error(`Error deleting contact with ID ${id}:`, error);
      throw error;
    }
  }
}

// React hooks para el dominio de transportes
export const useTransports = () => {
  return useQuery({
    queryKey: ['transports'],
    queryFn: TransportService.getAll
  });
};

export const useTransport = (id: string) => {
  return useQuery({
    queryKey: ['transports', id],
    queryFn: () => TransportService.getById(id),
    enabled: !!id
  });
};

export const useCreateTransport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: TransportService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
      toast({
        title: "Transporte creado",
        description: "El transporte ha sido creado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el transporte: ${error.message}`
      });
    }
  });
};

export const useUpdateTransport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transport> }) =>
      TransportService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
      queryClient.invalidateQueries({ queryKey: ['transports', variables.id] });
      toast({
        title: "Transporte actualizado",
        description: "El transporte ha sido actualizado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar el transporte: ${error.message}`
      });
    }
  });
};

export const useDeleteTransport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: TransportService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transports'] });
      toast({
        title: "Transporte eliminado",
        description: "El transporte ha sido eliminado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el transporte: ${error.message}`
      });
    }
  });
};

// Hooks para contactos de transportes
export const useTransportContacts = (transportId?: string) => {
  return useQuery({
    queryKey: ['transportContacts', transportId],
    queryFn: () => transportId ? TransportService.getContactsByTransportId(transportId) : [],
    enabled: !!transportId
  });
};

export const useCreateTransportContact = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: TransportService.createContact,
    onSuccess: (_, variables) => {
      if (variables.transportId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transportContacts', variables.transportId] 
        });
      }
      toast({
        title: "Contacto creado",
        description: "El contacto ha sido creado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el contacto: ${error.message}`
      });
    }
  });
};

export const useUpdateTransportContact = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransportContact> }) =>
      TransportService.updateContact(id, data),
    onSuccess: (_, variables) => {
      if (variables.data.transportId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transportContacts', variables.data.transportId] 
        });
      }
      toast({
        title: "Contacto actualizado",
        description: "El contacto ha sido actualizado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo actualizar el contacto: ${error.message}`
      });
    }
  });
};

export const useDeleteTransportContact = (transportId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: TransportService.deleteContact,
    onSuccess: () => {
      if (transportId) {
        queryClient.invalidateQueries({ 
          queryKey: ['transportContacts', transportId] 
        });
      }
      toast({
        title: "Contacto eliminado",
        description: "El contacto ha sido eliminado exitosamente"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el contacto: ${error.message}`
      });
    }
  });
};

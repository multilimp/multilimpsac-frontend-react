
import { supabase } from '@/integrations/supabase/client';
import { Transport, TransportDB, mapTransportFromDB, mapTransportToDB } from '../models/transport.model';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Class for Transport service
export default class TransportService {
  // Create a new transport
  static async create(data: Omit<Transport, 'id'>): Promise<Transport> {
    try {
      const mappedData = mapTransportToDB(data);
      
      // Ensure required fields have default values
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
  
  // Get all transports
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
  
  // Get a transport by ID
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
  
  // Update a transport
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
  
  // Delete a transport
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
}

// React hooks for transport domain
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

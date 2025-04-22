import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '../models/client.model';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Partial<Client>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isNewClient?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onSubmit,
  onCancel,
  isLoading = false,
  isNewClient = false
}) => {
  const { toast } = useToast();
  const isEditMode = !!client;
  
  const form = useForm<Partial<Client>>({
    defaultValues: {
      razonSocial: client?.razonSocial || '',
      ruc: client?.ruc || '',
      codUnidad: client?.codUnidad || '',
      direccion: client?.direccion || '',
      departamento: client?.departamento || '',
      provincia: client?.provincia || '',
      distrito: client?.distrito || '',
      estado: client?.estado ?? true,
    }
  });
  
  const handleFormSubmit = async (data: Partial<Client>) => {
    try {
      await onSubmit(data);
      if (isNewClient) {
        form.reset();
      }
      toast({
        title: `Cliente ${isEditMode ? 'actualizado' : 'creado'}`,
        description: `El cliente ha sido ${isEditMode ? 'actualizado' : 'creado'} exitosamente`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${isEditMode ? 'actualizar' : 'crear'} el cliente: ${error.message}`
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Editar Cliente' : 'Nuevo Cliente'}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="razonSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razón Social *</FormLabel>
                    <FormControl>
                      <Input placeholder="Razón Social" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ruc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RUC *</FormLabel>
                    <FormControl>
                      <Input placeholder="RUC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
                control={form.control}
                name="codUnidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Unidad *</FormLabel>
                    <FormControl>
                      <Input placeholder="Código de Unidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="departamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Departamento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="provincia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    <FormControl>
                      <Input placeholder="Provincia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="distrito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distrito</FormLabel>
                    <FormControl>
                      <Input placeholder="Distrito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'active')}
                    defaultValue={field.value ? 'active' : 'inactive'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ClientForm;
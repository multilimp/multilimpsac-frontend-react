
import React from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Transport } from '../models/transport.model';

interface TransportFormProps {
  transport?: Transport;
  onSubmit: (data: Partial<Transport>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TransportForm: React.FC<TransportFormProps> = ({
  transport,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { toast } = useToast();
  const isEditMode = !!transport;
  
  const form = useForm<Partial<Transport>>({
    defaultValues: {
      name: transport?.name || '',
      ruc: transport?.ruc || '',
      address: transport?.address || '',
      department: transport?.department || '',
      province: transport?.province || '',
      district: transport?.district || '',
      coverage: transport?.coverage || '',
      status: transport?.status || 'active',
    }
  });
  
  const handleFormSubmit = async (data: Partial<Transport>) => {
    try {
      await onSubmit(data);
      toast({
        title: `Transporte ${isEditMode ? 'actualizado' : 'creado'}`,
        description: `El transporte ha sido ${isEditMode ? 'actualizado' : 'creado'} exitosamente`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${isEditMode ? 'actualizar' : 'crear'} el transporte: ${error.message}`
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? 'Editar Transporte' : 'Nuevo Transporte'}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Razón Social</FormLabel>
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
                    <FormLabel>RUC</FormLabel>
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
              name="address"
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
                name="department"
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
                name="province"
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
                name="district"
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
              name="coverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cobertura</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describa las zonas de cobertura del transporte" 
                      className="resize-none min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Guardar'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default TransportForm;

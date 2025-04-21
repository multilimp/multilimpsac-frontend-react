
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Company } from '../models/company.model';

interface CompanyFormProps {
  initialData?: Partial<Company>;
  onSubmit: (data: Partial<Company>) => void;
  isSubmitting?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting = false 
}) => {
  const defaultValues = {
    razonSocial: initialData?.razonSocial || initialData?.name || '',
    ruc: initialData?.ruc || '',
    direccion: initialData?.direccion || initialData?.address || '',
    departamento: initialData?.departamento || '',
    provincia: initialData?.provincia || '',
    distrito: initialData?.distrito || '',
    telefono: initialData?.telefono || initialData?.phone || '',
    correo: initialData?.correo || initialData?.email || '',
    web: initialData?.web || '',
    codUnidad: initialData?.codUnidad || '',
    estado: initialData?.estado !== undefined 
      ? initialData.estado 
      : (initialData?.status === 'active' ? true : false)
  };

  const form = useForm({
    defaultValues
  });

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      // Map to both conventional and Spanish naming for compatibility
      razonSocial: data.razonSocial,
      name: data.razonSocial,
      direccion: data.direccion,
      address: data.direccion,
      telefono: data.telefono,
      phone: data.telefono,
      correo: data.correo,
      email: data.correo,
      estado: data.estado,
      status: data.estado ? 'active' : 'inactive',
      codUnidad: data.codUnidad
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="razonSocial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la empresa" {...field} />
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
                  <Input placeholder="Número de RUC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="codUnidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Unidad</FormLabel>
                <FormControl>
                  <Input placeholder="Código de unidad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Número de teléfono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="correo@empresa.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="web"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sitio Web</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="www.empresa.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Dirección completa" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Estado</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {field.value ? 'Activo' : 'Inactivo'}
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar Empresa'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyForm;

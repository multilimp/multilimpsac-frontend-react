
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddressForm from '@/components/common/AddressForm';
import { Supplier } from '../models/supplier.model';

const supplierFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  ruc: z.string().min(1, "El RUC es requerido"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Correo electrónico inválido").optional().or(z.string().length(0)),
  contact: z.string().optional(),
  department: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  amount: z.number().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (data: Partial<Supplier>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  supplier,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: supplier?.name || '',
      ruc: supplier?.ruc || '',
      address: supplier?.address || '',
      phone: supplier?.phone || '',
      email: supplier?.email || '',
      contact: supplier?.contact || '',
      department: supplier?.department || '',
      province: supplier?.province || '',
      district: supplier?.district || '',
      amount: supplier?.amount || 0,
      status: supplier?.status || 'active',
    }
  });

  const handleFormSubmit = async (values: SupplierFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Información General</TabsTrigger>
            <TabsTrigger value="address">Dirección</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razón Social</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contacto Principal</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monto</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Dirección</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressForm 
                  control={form.control}
                  addressField="address"
                  departmentField="department"
                  provinceField="province"
                  districtField="district"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : supplier ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierForm;


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Transport } from '../models/transport.model';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AddressForm from '@/components/common/AddressForm';

// Schema for transport form
const transportSchema = z.object({
  razon_social: z.string().min(1, { message: 'La razón social es requerida' }),
  ruc: z.string().min(11, { message: 'El RUC debe tener 11 dígitos' }).max(11),
  cobertura: z.string().optional(),
  direccion: z.string().optional(),
  departamento: z.string().optional(),
  provincia: z.string().optional(),
  distrito: z.string().optional(),
});

type TransportFormValues = z.infer<typeof transportSchema>;

interface TransportFormProps {
  transport?: Partial<Transport>;
  onSubmit: (data: Partial<Transport>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TransportForm: React.FC<TransportFormProps> = ({
  transport,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm<TransportFormValues>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      razon_social: transport?.razon_social || '',
      ruc: transport?.ruc || '',
      cobertura: transport?.cobertura || '',
      direccion: transport?.direccion || '',
      departamento: transport?.departamento || '',
      provincia: transport?.provincia || '',
      distrito: transport?.distrito || '',
    },
  });

  const handleFormSubmit = async (values: TransportFormValues) => {
    await onSubmit({
      ...transport,
      ...values,
      status: transport?.status || 'active',
    });
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
                    name="razon_social"
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
                    name="cobertura"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cobertura</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                  addressField="direccion"
                  departmentField="departamento"
                  provinceField="provincia"
                  districtField="distrito"
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
            {isLoading ? 'Guardando...' : transport?.id ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransportForm;

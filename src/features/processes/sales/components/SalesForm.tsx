
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { salesFormSchema, type SalesFormValues } from '../../../sales/models/salesForm.model';
import { CompanySection } from '../../processes/sales/form/CompanySection';
import { ClientSection } from '../../processes/sales/form/ClientSection';
import { DeliverySection } from '../../processes/sales/form/DeliverySection';
import { SiafSection } from '../../processes/sales/form/SiafSection';
import { DocumentsSection } from '../../processes/sales/form/DocumentsSection';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SalesFormProps {
  onSuccess: () => void;
}

export const SalesForm: React.FC<SalesFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const form = useForm<SalesFormValues>({
    resolver: zodResolver(salesFormSchema),
    defaultValues: {
      fechaFormalizacion: new Date().toISOString().split('T')[0],
      fechaMaxFormalizacion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fechaMaxEntrega: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      productos: '[]'
    }
  });

  const onSubmit = async (data: SalesFormValues) => {
    try {
      console.log('Form submitted:', data);
      toast({
        title: "Venta creada",
        description: "La venta se ha creado exitosamente",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la venta",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CompanySection form={form} />
            <ClientSection form={form} />
            <DeliverySection form={form} />
            <DocumentsSection form={form} />
            <SiafSection form={form} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSuccess}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Venta</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

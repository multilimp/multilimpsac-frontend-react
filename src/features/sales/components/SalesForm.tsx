
import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';

interface SalesFormProps {
  onSuccess: () => void;
}

const SalesForm: React.FC<SalesFormProps> = ({ onSuccess }) => {
  const form = useForm();
  
  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Here you would call your service to create the sale
    onSuccess();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Nueva Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Formulario para el registro de ventas (implementar en el siguiente sprint)
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onSuccess}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SalesForm;

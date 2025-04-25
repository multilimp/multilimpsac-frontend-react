
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SalesFormValues } from '../../../sales/models/salesForm.model';
import { UseFormReturn } from 'react-hook-form';

interface DeliverySectionProps {
  form: UseFormReturn<SalesFormValues>;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Entrega</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Esta sección se implementará próximamente</p>
      </CardContent>
    </Card>
  );
};

export default DeliverySection;

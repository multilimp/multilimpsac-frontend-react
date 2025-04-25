
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SalesFormValues } from '../../../../sales/models/salesForm.model';
import { UseFormReturn } from 'react-hook-form';

interface ClientSectionProps {
  form: UseFormReturn<SalesFormValues>;
}

const ClientSection: React.FC<ClientSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Esta sección se implementará próximamente</p>
      </CardContent>
    </Card>
  );
};

export default ClientSection;

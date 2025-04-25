
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SalesFormValues } from '../../../sales/models/salesForm.model';
import { UseFormReturn } from 'react-hook-form';

interface CompanySectionProps {
  form: UseFormReturn<SalesFormValues>;
}

const CompanySection: React.FC<CompanySectionProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Esta sección se implementará próximamente</p>
      </CardContent>
    </Card>
  );
};

export default CompanySection;

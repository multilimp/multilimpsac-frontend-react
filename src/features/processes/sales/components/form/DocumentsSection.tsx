
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { SalesFormValues } from '../../../../sales/models/salesForm.model';
import { UseFormReturn } from 'react-hook-form';

interface DocumentsSectionProps {
  form: UseFormReturn<SalesFormValues>;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">Esta sección se implementará próximamente</p>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;


import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SalesFormValues } from '../../models/salesForm.model';

interface DocumentsSectionProps {
  form: UseFormReturn<SalesFormValues>;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Documentos y Productos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="documentoOce"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>OCE</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file.name);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentoOcf"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>OCF</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file.name);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fechaMaxEntrega"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha Máxima de Entrega</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="productos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Productos (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='[{"id": "1", "nombre": "Producto 1", "cantidad": 2}]'
                    className="font-mono"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

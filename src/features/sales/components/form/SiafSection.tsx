
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SalesFormValues } from '../../models/salesForm.model';

interface SiafSectionProps {
  form: UseFormReturn<SalesFormValues>;
}

export const SiafSection: React.FC<SiafSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Información SIAF y Fechas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fechaFormalizacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Formalización</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fechaMaxFormalizacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha Máxima de Formalización</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="etapaSiaf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etapa SIAF</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingresar etapa SIAF" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numeroSiaf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número SIAF</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ingresar número SIAF" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="montoTotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto Total</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                  placeholder="0.00" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};


import React from 'react';
import { CardContent } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SalesFormData } from '@/features/sales/models/salesForm.model';

interface DocumentsSectionProps {
  data: SalesFormData;
  onChange: (values: Partial<SalesFormData>) => void;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ data, onChange }) => {
  return (
    <CardContent className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Documentos</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel>O/C-Electrónica</FormLabel>
          <Input 
            value={data.oce || ''} 
            onChange={(e) => onChange({ oce: e.target.value })}
            placeholder="O/C-Electrónica"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>O/C-Física</FormLabel>
          <Input 
            value={data.ocf || ''} 
            onChange={(e) => onChange({ ocf: e.target.value })}
            placeholder="O/C-Física"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Monto total</FormLabel>
          <Input 
            type="number"
            value={data.totalAmount || ''} 
            onChange={(e) => onChange({ totalAmount: parseFloat(e.target.value) })}
            placeholder="Monto total"
          />
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <FormLabel>Notas</FormLabel>
        <Textarea 
          value={data.notes || ''} 
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Notas adicionales"
          rows={4}
        />
      </div>
    </CardContent>
  );
};

export default DocumentsSection;

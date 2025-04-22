
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SalesFormData } from '@/features/sales/models/salesForm.model';

interface SiafSectionProps {
  data: SalesFormData;
  onChange: (values: Partial<SalesFormData>) => void;
}

const SiafSection: React.FC<SiafSectionProps> = ({ data, onChange }) => {
  return (
    <CardContent className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Datos SIAF</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel>Número SIAF</FormLabel>
          <Input 
            value={data.siafNumber || ''} 
            onChange={(e) => onChange({ siafNumber: e.target.value })}
            placeholder="Número SIAF"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Etapa SIAF</FormLabel>
          <Input 
            value={data.siafStage || ''} 
            onChange={(e) => onChange({ siafStage: e.target.value })}
            placeholder="Etapa SIAF"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Fecha SIAF</FormLabel>
          <Input 
            type="date"
            value={typeof data.siafDate === 'string' ? data.siafDate : ''}
            onChange={(e) => onChange({ siafDate: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Documento Peru Compras</FormLabel>
          <Input 
            value={data.peruComprasDoc || ''} 
            onChange={(e) => onChange({ peruComprasDoc: e.target.value })}
            placeholder="Documento Peru Compras"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Fecha Peru Compras</FormLabel>
          <Input 
            type="date"
            value={typeof data.peruComprasDate === 'string' ? data.peruComprasDate : ''}
            onChange={(e) => onChange({ peruComprasDate: e.target.value })}
          />
        </div>
      </div>
    </CardContent>
  );
};

export default SiafSection;

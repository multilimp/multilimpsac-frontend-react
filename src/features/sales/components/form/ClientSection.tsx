
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SalesFormData } from '@/features/sales/models/salesForm.model';

interface ClientSectionProps {
  data: SalesFormData;
  onChange: (values: Partial<SalesFormData>) => void;
}

const ClientSection: React.FC<ClientSectionProps> = ({ data, onChange }) => {
  return (
    <CardContent className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Datos del Cliente</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel>Cliente</FormLabel>
          <Input 
            value={data.clientName || ''} 
            onChange={(e) => onChange({ clientName: e.target.value })}
            placeholder="Nombre del cliente"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>RUC</FormLabel>
          <Input 
            value={data.clientRuc || ''} 
            onChange={(e) => onChange({ clientRuc: e.target.value })}
            placeholder="RUC del cliente"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Contacto</FormLabel>
          <Input 
            value={data.contactName || ''} 
            onChange={(e) => onChange({ contactName: e.target.value })}
            placeholder="Nombre del contacto"
          />
        </div>
      </div>
    </CardContent>
  );
};

export default ClientSection;

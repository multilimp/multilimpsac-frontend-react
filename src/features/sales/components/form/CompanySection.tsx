
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SalesFormData } from '@/features/sales/models/salesForm.model';

interface CompanySectionProps {
  data: SalesFormData;
  onChange: (values: Partial<SalesFormData>) => void;
}

const CompanySection: React.FC<CompanySectionProps> = ({ data, onChange }) => {
  return (
    <CardContent className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Datos de la Empresa</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel>Empresa</FormLabel>
          <Input 
            value={data.companyName || ''} 
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Nombre de la empresa"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>RUC</FormLabel>
          <Input 
            value={data.companyId || ''} 
            onChange={(e) => onChange({ companyId: e.target.value })}
            placeholder="RUC de la empresa"
          />
        </div>
      </div>
    </CardContent>
  );
};

export default CompanySection;

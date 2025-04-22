
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SalesFormData } from '@/features/sales/models/salesForm.model';

interface DeliverySectionProps {
  data: SalesFormData;
  onChange: (values: Partial<SalesFormData>) => void;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ data, onChange }) => {
  return (
    <CardContent className="space-y-4 p-6">
      <h2 className="text-xl font-semibold mb-4">Datos de Entrega</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormLabel>Dirección</FormLabel>
          <Input 
            value={data.deliveryAddress || ''} 
            onChange={(e) => onChange({ deliveryAddress: e.target.value })}
            placeholder="Dirección de entrega"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Región</FormLabel>
          <Input 
            value={data.deliveryRegion || ''} 
            onChange={(e) => onChange({ deliveryRegion: e.target.value })}
            placeholder="Región"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Provincia</FormLabel>
          <Input 
            value={data.deliveryProvince || ''} 
            onChange={(e) => onChange({ deliveryProvince: e.target.value })}
            placeholder="Provincia"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Distrito</FormLabel>
          <Input 
            value={data.deliveryDistrict || ''} 
            onChange={(e) => onChange({ deliveryDistrict: e.target.value })}
            placeholder="Distrito"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Referencia</FormLabel>
          <Input 
            value={data.deliveryReference || ''} 
            onChange={(e) => onChange({ deliveryReference: e.target.value })}
            placeholder="Referencia"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel>Fecha de entrega</FormLabel>
          <Input 
            type="date"
            value={typeof data.deliveryDate === 'string' ? data.deliveryDate : ''}
            onChange={(e) => onChange({ deliveryDate: e.target.value })}
          />
        </div>
      </div>
    </CardContent>
  );
};

export default DeliverySection;

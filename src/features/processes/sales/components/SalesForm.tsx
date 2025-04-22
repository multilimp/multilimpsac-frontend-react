
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalesFormData } from '@/features/sales/models/salesForm.model';
import CompanySection from '@/features/sales/components/form/CompanySection';
import ClientSection from '@/features/sales/components/form/ClientSection';
import DeliverySection from '@/features/sales/components/form/DeliverySection';
import SiafSection from '@/features/sales/components/form/SiafSection';
import DocumentsSection from '@/features/sales/components/form/DocumentsSection';

interface SalesFormProps {
  initialData?: Partial<SalesFormData>;
  onSubmit: (data: SalesFormData) => void;
  isSubmitting?: boolean;
}

const SalesForm: React.FC<SalesFormProps> = ({ 
  initialData, 
  onSubmit, 
  isSubmitting = false 
}) => {
  const [formData, setFormData] = React.useState<SalesFormData>(initialData || {});

  const handleChange = (section: keyof SalesFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="client">Cliente</TabsTrigger>
          <TabsTrigger value="delivery">Entrega</TabsTrigger>
          <TabsTrigger value="siaf">SIAF</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        
        <Card className="mb-6">
          <TabsContent value="company">
            <CompanySection
              data={formData}
              onChange={(value) => setFormData(prev => ({ ...prev, ...value }))}
            />
          </TabsContent>
          
          <TabsContent value="client">
            <ClientSection
              data={formData}
              onChange={(value) => setFormData(prev => ({ ...prev, ...value }))}
            />
          </TabsContent>
          
          <TabsContent value="delivery">
            <DeliverySection
              data={formData}
              onChange={(value) => setFormData(prev => ({ ...prev, ...value }))}
            />
          </TabsContent>
          
          <TabsContent value="siaf">
            <SiafSection
              data={formData}
              onChange={(value) => setFormData(prev => ({ ...prev, ...value }))}
            />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentsSection
              data={formData}
              onChange={(value) => setFormData(prev => ({ ...prev, ...value }))}
            />
          </TabsContent>
        </Card>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </Tabs>
    </form>
  );
};

export default SalesForm;

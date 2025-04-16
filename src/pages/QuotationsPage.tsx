
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardHeader, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Quotation } from '@/data/models/quotation';
import QuotationList from '@/features/quotation/components/QuotationList';
import QuotationForm from '@/features/quotation/components/QuotationForm';
import { useToast } from '@/components/ui/use-toast';
import { fetchQuotations } from '@/features/quotation/services/quotationService';
import PageHeader from '@/components/common/PageHeader';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';

const QuotationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const { toast } = useToast();

  const {
    data: quotations = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['quotations'],
    queryFn: fetchQuotations
  });

  const breadcrumbItems = [
    {
      label: "Cotizaciones",
      path: "/cotizaciones",
      isCurrentPage: true
    }
  ];

  const handleCreateSuccess = () => {
    toast({
      title: "Cotización creada",
      description: "La cotización se ha creado correctamente",
    });
    setActiveTab("list");
    refetch();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <PageHeader 
        title="Gestión de Cotizaciones" 
        subtitle="Administre las cotizaciones para sus clientes"
      />

      <Card>
        <CardHeader>
          <Tabs 
            defaultValue="list" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="list">Listado</TabsTrigger>
                <TabsTrigger value="new">Nueva Cotización</TabsTrigger>
              </TabsList>
              {activeTab === "list" && (
                <Button onClick={() => setActiveTab("new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Cotización
                </Button>
              )}
            </div>

            <div className="mt-2">
              <TabsContent value="list" className="m-0">
                <QuotationList 
                  quotations={quotations}
                  isLoading={isLoading}
                  onRefresh={refetch}
                />
              </TabsContent>
              <TabsContent value="new" className="m-0">
                <QuotationForm onSuccess={handleCreateSuccess} />
              </TabsContent>
            </div>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default QuotationsPage;

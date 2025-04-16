
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuotationList from '@/features/quotation/components/QuotationList';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/common/PageHeader';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import QuotationFormComponent from '@/features/quotation/components/QuotationFormComponent';
import { quotationService } from '@/features/quotation/services/quotationFormService';

const QuotationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const {
    data: quotations = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['quotations'],
    queryFn: () => quotationService.getAllQuotations()
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
      title: "Operación exitosa",
      description: "La cotización se ha procesado correctamente",
    });
    setActiveTab("list");
    setSelectedQuotationId(undefined);
    refetch();
  };

  const handleEdit = (id: string) => {
    setSelectedQuotationId(id);
    setActiveTab("edit");
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
                {selectedQuotationId && <TabsTrigger value="edit">Editar Cotización</TabsTrigger>}
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
                  onEdit={handleEdit}
                />
              </TabsContent>
              <TabsContent value="new" className="m-0">
                <QuotationFormComponent 
                  onSuccess={handleCreateSuccess} 
                  onCancel={() => setActiveTab("list")}
                />
              </TabsContent>
              {selectedQuotationId && (
                <TabsContent value="edit" className="m-0">
                  <QuotationFormComponent 
                    quotationId={selectedQuotationId}
                    onSuccess={handleCreateSuccess} 
                    onCancel={() => {
                      setActiveTab("list");
                      setSelectedQuotationId(undefined);
                    }}
                  />
                </TabsContent>
              )}
            </div>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default QuotationsPage;

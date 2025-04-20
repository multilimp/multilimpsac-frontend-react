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
import { PurchaseOrder } from '@/features/purchaseOrder/models/purchaseOrder';
import SalesList from '@/features/sales/components/SalesList';
import { SalesForm } from '@/features/sales/components/SalesForm';
import { useToast } from '@/components/ui/use-toast';
import { fetchSales } from '@/features/sales/services/salesService';
import PageHeader from '@/components/common/PageHeader';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';

const SalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const { toast } = useToast();

  const {
    data: sales = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['sales'],
    queryFn: fetchSales
  });

  const breadcrumbItems = [
    {
      label: "Ventas",
      path: "/ventas",
      isCurrentPage: true
    }
  ];

  const handleCreateSuccess = () => {
    toast({
      title: "Venta registrada",
      description: "La venta se ha registrado correctamente",
    });
    setActiveTab("list");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <PageHeader 
        title="Gestión de Ventas" 
        subtitle="Administre las órdenes de compra y ventas para sus clientes"
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
                <TabsTrigger value="new">Nueva Venta</TabsTrigger>
              </TabsList>
              {activeTab === "list" && (
                <Button onClick={() => setActiveTab("new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Venta
                </Button>
              )}
            </div>

            <div className="mt-2">
              <TabsContent value="list" className="m-0">
                <SalesList 
                  sales={[]}
                  isLoading={false}
                  onRefresh={() => {}}
                />
              </TabsContent>
              <TabsContent value="new" className="m-0">
                <SalesForm onSuccess={handleCreateSuccess} />
              </TabsContent>
            </div>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SalesPage;

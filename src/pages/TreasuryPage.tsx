
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
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/PageHeader';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { TreasuryList } from '@/features/treasury/components/TreasuryList';

const TreasuryPage = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const { toast } = useToast();

  const {
    data: treasuryData = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['treasury'],
    queryFn: () => Promise.resolve([]) // Implement actual treasury service later
  });

  const breadcrumbItems = [
    {
      label: "Tesorería",
      path: "/tesoreria",
      isCurrentPage: true
    }
  ];

  const handleCreateSuccess = () => {
    toast({
      title: "Registro creado",
      description: "El registro de tesorería se ha creado correctamente",
    });
    setActiveTab("list");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <PageHeader 
        title="Tesorería" 
        subtitle="Gestión de movimientos financieros"
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
                <TabsTrigger value="new">Nuevo Registro</TabsTrigger>
              </TabsList>
              {activeTab === "list" && (
                <Button onClick={() => setActiveTab("new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Registro
                </Button>
              )}
            </div>

            <div className="mt-2">
              <TabsContent value="list" className="m-0">
                <TreasuryList 
                  data={[]}
                  isLoading={isLoading}
                  onRefresh={refetch}
                />
              </TabsContent>
              <TabsContent value="new" className="m-0">
                {/* TreasuryForm component will be implemented later */}
              </TabsContent>
            </div>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default TreasuryPage;

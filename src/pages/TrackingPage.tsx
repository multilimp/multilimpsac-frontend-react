
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
import { TrackingList } from '@/features/tracking/components/TrackingList';

const TrackingPage = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const { toast } = useToast();

  const {
    data: trackingData = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['tracking'],
    queryFn: () => Promise.resolve([]) // Implement actual tracking service later
  });

  const breadcrumbItems = [
    {
      label: "Seguimiento de Órdenes",
      path: "/seguimiento",
      isCurrentPage: true
    }
  ];

  const handleCreateSuccess = () => {
    toast({
      title: "Seguimiento registrado",
      description: "El seguimiento se ha registrado correctamente",
    });
    setActiveTab("list");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <PageHeader 
        title="Seguimiento de Órdenes" 
        subtitle="Administre el seguimiento de sus órdenes de compra"
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
                <TabsTrigger value="new">Nuevo Seguimiento</TabsTrigger>
              </TabsList>
              {activeTab === "list" && (
                <Button onClick={() => setActiveTab("new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Seguimiento
                </Button>
              )}
            </div>

            <div className="mt-2">
              <TabsContent value="list" className="m-0">
                <TrackingList 
                  data={[]}
                  isLoading={isLoading}
                  onRefresh={refetch}
                />
              </TabsContent>
              <TabsContent value="new" className="m-0">
                {/* TrackingForm component will be implemented later */}
              </TabsContent>
            </div>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
};

export default TrackingPage;

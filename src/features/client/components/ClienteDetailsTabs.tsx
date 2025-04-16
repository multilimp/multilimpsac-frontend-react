
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClienteDetailsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children?: React.ReactNode;
}

const ClienteDetailsTabs: React.FC<ClienteDetailsTabsProps> = ({
  activeTab,
  onTabChange,
  children
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="details">Detalles</TabsTrigger>
        <TabsTrigger value="contactos">Contactos</TabsTrigger>
        <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
        <TabsTrigger value="facturas">Facturas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Detalles del cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Información adicional del cliente...</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      {children}
    </Tabs>
  );
};

export default ClienteDetailsTabs;

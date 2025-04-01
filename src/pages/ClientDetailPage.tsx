
import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Handle tab changes to navigate to the appropriate route
  const handleTabChange = (value: string) => {
    if (value === 'details') {
      navigate(`/clientes/${id}`);
    } else {
      navigate(`/clientes/${id}/${value}`);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Detalle del Cliente</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cliente #{id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p>Cliente ejemplo</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">RUC</p>
                <p>20600123456</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dirección</p>
                <p>Av. Ejemplo 123, Lima</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p>+51 987654321</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="details" onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="contactos">Contactos</TabsTrigger>
            <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
            <TabsTrigger value="facturas">Facturas</TabsTrigger>
          </TabsList>
          
          {/* Outlet for nested routes */}
          <Outlet />
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailPage;

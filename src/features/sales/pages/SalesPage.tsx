
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import SalesList from '../components/SalesList';

const SalesPage = () => {
  const navigate = useNavigate();
  
  // Mock data for placeholder
  const sales = [];
  const isLoading = false;
  const handleRefresh = () => {}; // Placeholder
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Ventas"
        description="Gestión de ventas y órdenes de compra"
        actions={
          <Button onClick={() => navigate('/ventas/nueva')}>
            Nueva Venta
          </Button>
        }
      />
      
      <SalesList 
        sales={sales} 
        isLoading={isLoading} 
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default SalesPage;

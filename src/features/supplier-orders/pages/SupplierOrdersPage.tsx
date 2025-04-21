
import React from 'react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import { SupplierOrderList } from '../components/SupplierOrderList';
import { useNavigate } from 'react-router-dom';

const SupplierOrdersPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Órdenes de Proveedor"
        description="Gestión de órdenes a proveedores"
        actions={
          <Button onClick={() => navigate('/proveedores/ordenes/nueva')}>
            Nueva Orden
          </Button>
        }
      />
      
      <SupplierOrderList />
    </div>
  );
};

export default SupplierOrdersPage;

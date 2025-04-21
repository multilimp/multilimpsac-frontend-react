
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SalesList from '@/features/sales/components/SalesList';

const SalesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ventas"
        description="Gestiona todas las ventas de productos y servicios"
        showAddButton
        addButtonText="Nueva Venta"
        onAddClick={() => {
          // Handle navigation to new sale page
          window.location.href = '/ventas/nueva';
        }}
      />
      <SalesList />
    </div>
  );
};

export default SalesPage;

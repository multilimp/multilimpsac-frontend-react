
import React from 'react';
import { Package } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import PurchaseOrderList from '@/components/purchases/PurchaseOrderList';

const PurchaseOrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Órdenes de Compra"
        description="Gestiona todas las órdenes de compra"
        showAddButton
        addButtonText="Nueva Orden"
        onAddClick={() => {
          // Handle navigation to new purchase order page
          window.location.href = '/ordenes/nueva';
        }}
      />
      <PurchaseOrderList />
    </div>
  );
};

export default PurchaseOrdersPage;

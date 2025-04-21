
import React from 'react';
import { Package } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SupplierOrderList from '@/features/supplier-orders/components/SupplierOrderList';

const SupplierOrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Órdenes de Proveedor"
        description="Gestiona todas las órdenes enviadas a proveedores"
        showAddButton
        addButtonText="Nueva Orden de Proveedor"
        onAddClick={() => {
          // Handle navigation to new supplier order page
          window.location.href = '/ordenes/proveedor/nueva';
        }}
      />
      <SupplierOrderList />
    </div>
  );
};

export default SupplierOrdersPage;

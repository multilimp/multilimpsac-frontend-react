
import React from 'react';
import { SupplierOrderList } from '@/features/supplier-orders/components/SupplierOrderList';
import SecondaryNavWrapper from '@/components/layout/SecondaryNavWrapper';
import { Box, Package, Truck } from 'lucide-react';

const navItems = [
  { label: "Órdenes de Compra", path: "/ordenes", icon: Box },
  { label: "Órdenes de Proveedor", path: "/ordenes/proveedor", icon: Package },
  { label: "Transportes", path: "/ordenes/transportes", icon: Truck }
];

const SupplierOrdersPage = () => {
  return (
    <SecondaryNavWrapper navItems={navItems} title="Órdenes">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Órdenes de Proveedor</h1>
        <SupplierOrderList />
      </div>
    </SecondaryNavWrapper>
  );
};

export default SupplierOrdersPage;

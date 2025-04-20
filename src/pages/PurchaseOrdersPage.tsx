import React from 'react';
import PurchaseOrderList from '@/components/purchases/PurchaseOrderList';
import SecondaryNavWrapper from '@/components/layout/SecondaryNavWrapper';
import { Box, Package, Truck } from 'lucide-react';
const navItems = [{
  label: "Órdenes de Compra",
  path: "/ordenes",
  icon: Box
}, {
  label: "Órdenes de Proveedor",
  path: "/ordenes/proveedor",
  icon: Package
}, {
  label: "Transportes",
  path: "/ordenes/transportes",
  icon: Truck
}];
const PurchaseOrdersPage = () => {
  return <SecondaryNavWrapper navItems={navItems} title="Órdenes">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Órdenes de Proveedores</h1>
        <PurchaseOrderList />
      </div>
    </SecondaryNavWrapper>;
};
export default PurchaseOrdersPage;

import React from 'react';
import { TrackingList } from '@/features/tracking/components/TrackingList';
import SecondaryNavWrapper from '@/components/layout/SecondaryNavWrapper';
import { Box, Package, Truck } from 'lucide-react';

const navItems = [
  { label: "Órdenes de Compra", path: "/ordenes", icon: Box },
  { label: "Órdenes de Proveedor", path: "/ordenes/proveedor", icon: Package },
  { label: "Transportes", path: "/ordenes/transportes", icon: Truck }
];

const TrackingPage = () => {
  return (
    <SecondaryNavWrapper navItems={navItems} title="Órdenes">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Seguimiento de Órdenes</h1>
        <TrackingList />
      </div>
    </SecondaryNavWrapper>
  );
};

export default TrackingPage;

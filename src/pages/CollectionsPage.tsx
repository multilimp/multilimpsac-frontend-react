
import React from 'react';
import { CollectionsList } from '@/features/collections/components/CollectionsList';
import SecondaryNavWrapper from '@/components/layout/SecondaryNavWrapper';
import { CreditCard, FileText, ReceiptText } from 'lucide-react';

const navItems = [
  { label: "Tesorería", path: "/tesoreria", icon: CreditCard },
  { label: "Facturación", path: "/facturacion", icon: FileText },
  { label: "Cobranzas", path: "/cobranzas", icon: ReceiptText }
];

const CollectionsPage = () => {
  return (
    <SecondaryNavWrapper navItems={navItems} title="Finanzas">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Cobranzas</h1>
        <CollectionsList />
      </div>
    </SecondaryNavWrapper>
  );
};

export default CollectionsPage;

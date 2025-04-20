
import React from 'react';
import { TreasuryList } from '@/features/treasury/components/TreasuryList';
import SecondaryNavWrapper from '@/components/layout/SecondaryNavWrapper';
import { CreditCard, FileText, ReceiptText } from 'lucide-react';

const navItems = [
  { label: "Tesorería", path: "/tesoreria", icon: CreditCard },
  { label: "Facturación", path: "/facturacion", icon: FileText },
  { label: "Cobranzas", path: "/cobranzas", icon: ReceiptText }
];

const TreasuryPage = () => {
  return (
    <SecondaryNavWrapper navItems={navItems} title="Finanzas">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Tesorería</h1>
        <TreasuryList />
      </div>
    </SecondaryNavWrapper>
  );
};

export default TreasuryPage;

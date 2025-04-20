
import React from 'react';
import { BillingList } from '@/features/billing/components/BillingList';
import SecondaryNavWrapper from '@/components/layout/SecondaryNavWrapper';
import { CreditCard, FileText, ReceiptText } from 'lucide-react';

const navItems = [
  { label: "Tesorería", path: "/tesoreria", icon: CreditCard },
  { label: "Facturación", path: "/facturacion", icon: FileText },
  { label: "Cobranzas", path: "/cobranzas", icon: ReceiptText }
];

const BillingPage = () => {
  return (
    <SecondaryNavWrapper navItems={navItems} title="Finanzas">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Facturación</h1>
        <BillingList />
      </div>
    </SecondaryNavWrapper>
  );
};

export default BillingPage;


import React from 'react';
import { FileSearch } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import QuotationList from '@/features/quotation/components/QuotationList';

const QuotationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cotizaciones"
        description="Gestiona todas las cotizaciones de productos y servicios"
        showAddButton
        addButtonText="Nueva Cotización"
        onAddClick={() => {
          // Handle navigation to new quotation page
          window.location.href = '/cotizaciones/nueva';
        }}
      />
      <QuotationList />
    </div>
  );
};

export default QuotationsPage;

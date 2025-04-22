
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import QuotationCatalogTable from '@/features/quotation/components/QuotationCatalogTable';

const QuotationsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Cotizaciones"
        description="Catálogo y consulta de cotizaciones"
      />
      <QuotationCatalogTable />
    </div>
  );
};

export default QuotationsPage;

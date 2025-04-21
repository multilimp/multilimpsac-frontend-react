
import React from 'react';
import { useQuotationActions } from '../hooks/useQuotationActions';
import QuotationList from '../components/QuotationList';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const QuotationsPage = () => {
  const navigate = useNavigate();
  const { 
    quotations, 
    isLoading, 
    handleRefresh, 
    handleEdit, 
    handleDelete
  } = useQuotationActions();

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Cotizaciones"
        description="Gestión de cotizaciones"
        actions={
          <Button onClick={() => navigate('/cotizaciones/nueva')}>
            Nueva Cotización
          </Button>
        }
      />
      
      <QuotationList 
        quotations={quotations || []} 
        isLoading={isLoading} 
        onRefresh={handleRefresh} 
        onEdit={handleEdit} 
      />
    </div>
  );
};

export default QuotationsPage;

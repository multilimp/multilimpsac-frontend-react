
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';
import QuotationList from '../../../quotation/components/QuotationList';

const QuotationsPage = () => {
  const navigate = useNavigate();
  
  // Mock data for placeholder
  const quotations = [];
  const isLoading = false;
  const handleRefresh = () => {}; // Placeholder
  const handleEdit = () => {}; // Placeholder
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Cotizaciones"
        description="Gestión de cotizaciones para clientes"
        actions={
          <Button onClick={() => navigate('/cotizaciones/nueva')}>
            Nueva Cotización
          </Button>
        }
      />
      
      <QuotationList 
        quotations={quotations} 
        isLoading={isLoading} 
        onRefresh={handleRefresh}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default QuotationsPage;


import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { useNavigate } from 'react-router-dom';

const ClienteDetailLoading: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Cargando detalles del cliente" 
        description="Por favor espere mientras se cargan los datos..."
        backButton={{
          label: "Volver a clientes",
          onClick: () => navigate("/clientes"),
        }}
      />
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando información...</div>
      </div>
    </div>
  );
};

export default ClienteDetailLoading;

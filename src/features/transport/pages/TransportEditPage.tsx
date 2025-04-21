
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { useTransport, useUpdateTransport, useCreateTransport } from '../services/transport.service';
import TransportForm from '../components/TransportForm';
import { Transport } from '../models/transport.model';

const TransportEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewTransport = id === 'new';
  
  const { data: transport, isLoading, error } = useTransport(id || '');
  const updateMutation = useUpdateTransport();
  const createMutation = useCreateTransport();
  
  const breadcrumbItems = [
    {
      label: "Transportes",
      path: "/transportes",
    },
    {
      label: isNewTransport ? "Nuevo Transporte" : (transport?.name || "Editar"),
      path: isNewTransport ? "/transportes/new" : `/transportes/${id}/edit`,
      isCurrentPage: true
    }
  ];
  
  const handleBackClick = () => {
    if (isNewTransport) {
      navigate('/transportes');
    } else {
      navigate(`/transportes/${id}`);
    }
  };
  
  const handleFormSubmit = async (data: Partial<Transport>) => {
    if (isNewTransport) {
      // For new transport, provide required fields
      const newTransportData: Omit<Transport, 'id'> = {
        name: data.name || '',
        ruc: data.ruc || '',
        address: data.address || '',
        coverage: data.coverage || '',
        phone: data.phone || '',
        email: data.email || '',
        contact: data.contact || '',
        status: data.status || 'active',
        department: data.department,
        province: data.province,
        district: data.district
      };
      
      const newTransport = await createMutation.mutateAsync(newTransportData);
      navigate(`/transportes/${newTransport.id}`);
    } else if (id) {
      await updateMutation.mutateAsync({ id, data });
      navigate(`/transportes/${id}`);
    }
  };
  
  if (!isNewTransport && isLoading) {
    return <LoadingFallback />;
  }
  
  if (!isNewTransport && (error || !transport)) {
    return (
      <div className="p-4">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {(error as Error)?.message || "No se pudo cargar el transporte"}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate('/transportes')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Transportes
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isNewTransport ? 'Transportes' : 'Detalles'}
        </Button>
        <h1 className="text-2xl font-bold">
          {isNewTransport ? "Nuevo Transporte" : `Editar ${transport?.name}`}
        </h1>
      </div>
      
      <TransportForm
        transport={isNewTransport ? undefined : transport}
        onSubmit={handleFormSubmit}
        onCancel={handleBackClick}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default TransportEditPage;

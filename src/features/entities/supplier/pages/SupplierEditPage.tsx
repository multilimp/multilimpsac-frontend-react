
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { useSupplier, useUpdateSupplier, useCreateSupplier } from '../services/supplier.service';
import SupplierForm from '../components/SupplierForm';
import { Supplier } from '../models/supplier.model';

const SupplierEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewSupplier = id === 'new';
  
  const { data: supplier, isLoading, error } = useSupplier(id || '');
  const updateMutation = useUpdateSupplier();
  const createMutation = useCreateSupplier();
  
  const breadcrumbItems = [
    {
      label: "Proveedores",
      path: "/proveedores",
    },
    {
      label: isNewSupplier ? "Nuevo Proveedor" : (supplier?.name || "Editar"),
      path: isNewSupplier ? "/proveedores/new" : `/proveedores/${id}/edit`,
      isCurrentPage: true
    }
  ];
  
  const handleBackClick = () => {
    if (isNewSupplier) {
      navigate('/proveedores');
    } else {
      navigate(`/proveedores/${id}`);
    }
  };
  
  const handleFormSubmit = async (data: Partial<Supplier>) => {
    if (isNewSupplier) {
      const newSupplier = await createMutation.mutateAsync(data as Omit<Supplier, 'id'>);
      navigate(`/proveedores/${newSupplier.id}`);
    } else if (id) {
      await updateMutation.mutateAsync({ id, data });
      navigate(`/proveedores/${id}`);
    }
  };
  
  if (!isNewSupplier && isLoading) {
    return <LoadingFallback />;
  }
  
  if (!isNewSupplier && (error || !supplier)) {
    return (
      <div className="p-4">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {(error as Error)?.message || "No se pudo cargar el proveedor"}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate('/proveedores')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Proveedores
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
          {isNewSupplier ? 'Proveedores' : 'Detalles'}
        </Button>
        <h1 className="text-2xl font-bold">
          {isNewSupplier ? "Nuevo Proveedor" : `Editar ${supplier?.name}`}
        </h1>
      </div>
      
      <SupplierForm
        supplier={isNewSupplier ? undefined : supplier}
        onSubmit={handleFormSubmit}
        onCancel={handleBackClick}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default SupplierEditPage;

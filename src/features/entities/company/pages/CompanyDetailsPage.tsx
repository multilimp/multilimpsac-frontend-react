
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Pencil } from 'lucide-react';
import PageWithSecondaryNav from '@/components/layout/PageWithSecondaryNav';
import SecondaryNavWrapper from '@/components/layout/SecondaryNavWrapper';
import CompanyDetailPanel from '../components/CompanyDetailPanel';
import { companyService, useCompany } from '../index';
import { Company } from '../models/company.model'; // Import the Company type

const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  
  const { data: company, isLoading, error } = useCompany(id || '');
  
  const isNewCompany = id === 'new';
  
  const navItems = [
    { 
      label: "Detalles", 
      path: `/empresas/${id}`,
      icon: Building2
    }
  ];
  
  const handleEditClick = () => {
    navigate(`/empresas/${id}/edit`);
  };
  
  const handleBackClick = () => {
    navigate('/empresas');
  };
  
  const handleFormSubmit = async (data: Partial<Company>) => {
    try {
      if (isNewCompany) {
        // Handle create
        const newCompany = await companyService.createCompany(data);
        navigate(`/empresas/${newCompany.id}`);
      } else if (id) {
        // Handle update
        await companyService.updateCompany(id, {
          ...data,
          direccion: data.direccion || data.address, // Map address to direccion
          telefono: data.telefono || data.phone, // Map phone to telefono
          correo: data.correo || data.email, // Map email to correo
          razonSocial: data.razonSocial || data.name, // Map name to razonSocial
          estado: data.estado !== undefined ? data.estado : (data.status === 'active')
        });
        navigate(`/empresas/${id}`);
      }
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };
  
  if (isLoading) {
    return (
      <PageWithSecondaryNav>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Cargando datos de la empresa...</p>
        </div>
      </PageWithSecondaryNav>
    );
  }
  
  if (error && !isNewCompany) {
    return (
      <PageWithSecondaryNav>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-destructive">Error al cargar los datos de la empresa</p>
          <Button variant="outline" onClick={handleBackClick} className="mt-4">
            Volver a la lista
          </Button>
        </div>
      </PageWithSecondaryNav>
    );
  }
  
  return (
    <SecondaryNavWrapper navItems={navItems} title="Detalles de Empresa">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Empresas
            </Button>
            <h1 className="text-2xl font-bold">
              {isNewCompany ? "Nueva Empresa" : company?.razonSocial || company?.name}
            </h1>
          </div>
          
          {!isNewCompany && (
            <Button onClick={handleEditClick}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Detalles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            {company && <CompanyDetailPanel company={company} />}
          </TabsContent>
        </Tabs>
      </div>
    </SecondaryNavWrapper>
  );
};

export default CompanyDetailsPage;


import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "..";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CompanyForm } from "../components/CompanyForm";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { ArrowLeft, ListPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Company } from "../models/company.model";
import PageHeader from "@/components/common/PageHeader";

const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNewCompany = !id || id === 'new';

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => (isNewCompany ? null : companyService.fetchCompanyById(id!)),
    enabled: !isNewCompany && !!id,
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data: Partial<Company>) => {
      // Ensure required fields are present for new companies
      const companyData = isNewCompany ? {
        ...data,
        address: data.address || 'Default Address', // Ensure address is provided
        status: data.status || 'active',
      } : data;
      
      if (isNewCompany) {
        return companyService.createCompany(companyData as Omit<Company, "id">);
      } else {
        return companyService.updateCompany(id!, companyData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      toast({
        title: isNewCompany ? "Empresa creada" : "Empresa actualizada",
        description: isNewCompany 
          ? "La empresa ha sido creada exitosamente" 
          : "Los datos de la empresa han sido actualizados",
      });
      
      if (isNewCompany) {
        navigate("/empresas");
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${isNewCompany ? "crear" : "actualizar"} la empresa: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });
    },
  });

  const handleSave = async (data: Partial<Company>) => {
    updateCompanyMutation.mutate(data);
  };

  const breadcrumbItems = [
    {
      label: "Empresas",
      path: "/empresas",
      isCurrentPage: false
    },
    {
      label: isNewCompany ? "Nueva Empresa" : company?.name || "Detalles",
      path: isNewCompany ? "/empresas/new" : `/empresas/${id}`,
      isCurrentPage: true
    }
  ];

  // Definir datos iniciales vacíos para el caso de nueva empresa
  const emptyCompany: Partial<Company> = {
    name: "",
    ruc: "",
    address: "",
    phone: "",
    email: "",
    status: "active",
    web: "",
    direcciones: "",
    cod_unidad: "",
    departamento: "",
    provincia: "",
    distrito: "",
    contact: ""
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/empresas')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          {!isNewCompany && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/empresas/${id}/catalogos`)}
            >
              <ListPlus className="h-4 w-4 mr-2" />
              Ver Catálogos
            </Button>
          )}
        </div>
      </div>
      
      <PageHeader
        title={isNewCompany ? "Nueva Empresa" : `Empresa: ${company?.name || ''}`}
        subtitle={isNewCompany ? "Complete los datos para registrar una nueva empresa" : "Gestione los datos de la empresa"}
      />

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Empresa</CardTitle>
          <CardDescription>
            Complete los campos requeridos para {isNewCompany ? "registrar la" : "actualizar la"} empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isNewCompany ? (
            <CompanyForm
              initialData={emptyCompany}
              onSubmit={handleSave}
              isSubmitting={updateCompanyMutation.isPending}
              isNewCompany={true}
            />
          ) : (
            !isLoading && company && (
              <CompanyForm
                initialData={company}
                onSubmit={handleSave}
                isSubmitting={updateCompanyMutation.isPending}
                isNewCompany={false}
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDetailsPage;

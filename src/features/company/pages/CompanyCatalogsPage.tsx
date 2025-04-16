
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { EntityDataTable } from "@/features/shared/components/entity-data-table";
import { companyService } from "../services/company.service";
import { CompanyCatalog } from "../models/company.model";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import PageHeader from "@/components/common/PageHeader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const catalogSchema = z.object({
  codigo: z.string().min(1, { message: "El código es requerido" }),
});

type CatalogFormData = z.infer<typeof catalogSchema>;

const CompanyCatalogsPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  
  const { data: company } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companyService.fetchCompanyById(companyId!),
    enabled: !!companyId,
  });

  const { data: catalogs = [], isLoading, refetch } = useQuery({
    queryKey: ["companyCatalogs", companyId],
    queryFn: () => companyService.fetchCompanyCatalogs(companyId!),
    enabled: !!companyId,
  });

  const breadcrumbItems = [
    {
      label: "Empresas",
      path: "/empresas",
      isCurrentPage: false
    },
    {
      label: company?.name || "Empresa",
      path: `/empresas/${companyId}/catalogos`,
      isCurrentPage: true
    }
  ];

  const columns = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'codigo', name: 'Código', type: 'string', sortable: true, filterable: true },
    { key: 'created_at', name: 'Fecha de Creación', type: 'date', sortable: true, filterable: true },
  ];

  const renderFormContent = (data: Partial<CompanyCatalog>, onChange: (field: string, value: any) => void) => {
    const form = useForm<CatalogFormData>({
      resolver: zodResolver(catalogSchema),
      defaultValues: {
        codigo: data.codigo || '',
      }
    });

    return (
      <Form {...form}>
        <form className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código*</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange('codigo', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  const handleSaveCatalog = async (formData: Partial<CompanyCatalog>) => {
    if (!companyId) return;
    
    return companyService.saveCompanyCatalog({
      ...formData,
      empresa_id: parseInt(companyId)
    });
  };

  return (
    <div>
      <BreadcrumbNav items={breadcrumbItems} />
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/empresas')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Empresas
        </Button>
      </div>
      <PageHeader
        title={`Catálogos de ${company?.name || 'Empresa'}`}
        subtitle="Gestione los catálogos de la empresa"
      />
      <EntityDataTable<CompanyCatalog>
        title="Catálogos"
        description="Gestione los catálogos de la empresa"
        data={catalogs}
        isLoading={isLoading}
        columns={columns}
        onReload={refetch}
        renderFormContent={renderFormContent}
        onSave={handleSaveCatalog}
        onDelete={companyService.deleteCompanyCatalog}
        addButtonText="Agregar Catálogo"
        domain="company"
        permissionScope="companyCatalogs"
      />
    </div>
  );
};

export default CompanyCatalogsPage;

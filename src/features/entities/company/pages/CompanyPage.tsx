import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { Company } from "@/features/entities/company/models/company.model";
import { companyService } from "..";
import { DataGridColumn } from "@/components/ui/data-grid/types";
import { DataGrid } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: companies = [], isLoading, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: companyService.fetchCompanies,
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: (id: string) => companyService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa eliminada",
        description: "La empresa ha sido eliminada exitosamente",
      });
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar la empresa: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });
    },
  });

  const breadcrumbItems = [
    {
      label: "Empresas",
      path: "/empresas",
      isCurrentPage: true
    }
  ];

  const columns: DataGridColumn[] = [
    { key: 'name', name: 'Empresa', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'phone', name: 'Teléfono', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Email', type: 'string', sortable: true, filterable: true },
    { key: 'address', name: 'Direccion', type: 'string', sortable: true, filterable: true },
    { key: 'actions', name: 'Acciones', type: 'string', sortable: false, filterable: false },
  ];

  const handleRowClick = (company: Company) => {
    navigate(`/empresas/${company.id}`);
  };

  const handleEditCompany = (company: Company) => {
    navigate(`/empresas/${company.id}/edit`);
  };

  const handleDeleteCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCompany) {
      deleteCompanyMutation.mutate(selectedCompany.id);
    }
  };

  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex justify-between items-center">
        <PageHeader
          title="Empresas"
          subtitle="Gestione las empresas registradas en el sistema"
        />
        <Button onClick={() => navigate('/empresas/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Empresa
        </Button>
      </div>
      
      <div className="rounded-md border bg-card">
        <DataGrid
          data={companies}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          onRowClick={handleRowClick}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
          onReload={refetch}
        />
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la empresa 
              {selectedCompany?.name ? ` "${selectedCompany.name}"` : ''} y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCompanyMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyPage;

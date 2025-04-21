import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "..";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataGrid } from "@/components/ui/data-grid";
import { DataGridColumn } from "@/components/ui/data-grid/types";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CompanyCatalog } from "../models/company.model";
import PageHeader from "@/components/common/PageHeader";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { CatalogForm } from "../components/CatalogForm";

const CompanyCatalogsPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCatalog, setSelectedCatalog] = React.useState<CompanyCatalog | null>(null);
  
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

  const saveCatalogMutation = useMutation({
    mutationFn: (data: Partial<CompanyCatalog>) => {
      if (data.id) {
        return companyService.updateCompanyCatalog(data.id, data);
      } else {
        return companyService.createCompanyCatalog({
          ...data,
          empresaId: companyId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyCatalogs", companyId] });
      toast({
        title: selectedCatalog ? "Catálogo actualizado" : "Catálogo creado",
        description: selectedCatalog 
          ? "El catálogo ha sido actualizado exitosamente" 
          : "El catálogo ha sido creado exitosamente",
      });
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedCatalog(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo ${selectedCatalog ? "actualizar" : "crear"} el catálogo: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });
    },
  });

  const deleteCatalogMutation = useMutation({
    mutationFn: (id: string) => companyService.deleteCompanyCatalog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyCatalogs", companyId] });
      toast({
        title: "Catálogo eliminado",
        description: "El catálogo ha sido eliminado exitosamente",
      });
      setIsDeleteDialogOpen(false);
      setSelectedCatalog(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el catálogo: ${error instanceof Error ? error.message : "Error desconocido"}`,
      });
    },
  });

  const handleAddCatalog = () => {
    setSelectedCatalog(null);
    setIsAddDialogOpen(true);
  };

  const handleEditCatalog = (catalog: CompanyCatalog) => {
    setSelectedCatalog(catalog);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCatalog = (catalog: CompanyCatalog) => {
    setSelectedCatalog(catalog);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveCatalog = async (data: Partial<CompanyCatalog>) => {
    saveCatalogMutation.mutate({
      ...selectedCatalog,
      ...data
    });
  };

  const handleConfirmDelete = () => {
    if (selectedCatalog) {
      deleteCatalogMutation.mutate(selectedCatalog.id);
    }
  };

  const breadcrumbItems = [
    {
      label: "Empresas",
      path: "/empresas",
      isCurrentPage: false
    },
    {
      label: company?.razonSocial || company?.name || "Empresa",
      path: `/empresas/${companyId}`,
      isCurrentPage: false
    },
    {
      label: "Catálogos",
      path: `/empresas/${companyId}/catalogos`,
      isCurrentPage: true
    }
  ];

  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'codigo', name: 'Código', type: 'string', sortable: true, filterable: true },
    { key: 'created_at', name: 'Fecha de Creación', type: 'date', sortable: true, filterable: true },
    { key: 'actions', name: 'Acciones', type: 'string', sortable: false, filterable: false },
  ];

  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate(`/empresas/${companyId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a la Empresa
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <PageHeader
          title={`Catálogos de ${company?.razonSocial || company?.name || 'la Empresa'}`}
          subtitle="Gestione los catálogos asociados a esta empresa"
        />
        <Button onClick={handleAddCatalog}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Catálogo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogos</CardTitle>
          <CardDescription>
            Lista de catálogos registrados para esta empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataGrid
            data={catalogs}
            columns={columns}
            loading={isLoading}
            pageSize={10}
            onReload={refetch}
            onEdit={handleEditCatalog}
            onDelete={handleDeleteCatalog}
          />
        </CardContent>
      </Card>

      {/* Diálogo para agregar catálogo */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Catálogo</DialogTitle>
            <DialogDescription>
              Complete los campos para agregar un nuevo catálogo a {company?.name}
            </DialogDescription>
          </DialogHeader>
          <CatalogForm
            onSubmit={handleSaveCatalog}
            isSubmitting={saveCatalogMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar catálogo */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Catálogo</DialogTitle>
            <DialogDescription>
              Modifique los campos para actualizar el catálogo
            </DialogDescription>
          </DialogHeader>
          {selectedCatalog && (
            <CatalogForm
              initialData={selectedCatalog}
              onSubmit={handleSaveCatalog}
              isSubmitting={saveCatalogMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el catálogo 
              {selectedCatalog?.codigo ? ` "${selectedCatalog.codigo}"` : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCatalogMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CompanyCatalogsPage;

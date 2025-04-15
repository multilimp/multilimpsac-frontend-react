
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
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
import { Switch } from "@/components/ui/switch";
import { Company } from "@/features/company/models/company.model";
import { companyService } from "@/features/company/services/company.service";

const CompanyPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Partial<Company>>({
    status: "active",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const breadcrumbItems = [
    {
      label: "Empresas",
      path: "/empresas",
      isCurrentPage: true
    }
  ];

  // Fetch companies data
  const { data: companies = [], isLoading, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: companyService.fetchCompanies,
  });

  // Create company mutation
  const createMutation = useMutation({
    mutationFn: companyService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa agregada",
        description: "La empresa ha sido agregada correctamente",
      });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al agregar la empresa",
      });
    },
  });

  // Update company mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) => 
      companyService.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa actualizada",
        description: "La empresa ha sido actualizada correctamente",
      });
      resetForm();
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al actualizar la empresa",
      });
    },
  });

  // Delete company mutation
  const deleteMutation = useMutation({
    mutationFn: companyService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Empresa eliminada",
        description: "La empresa ha sido eliminada correctamente",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al eliminar la empresa",
      });
    },
  });

  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'name', name: 'Empresa', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'contact', name: 'Contacto', type: 'string', sortable: true, filterable: true },
    { key: 'phone', name: 'Teléfono', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Email', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleReload = () => {
    refetch();
    toast({
      title: "Datos actualizados",
      description: "La lista de empresas ha sido actualizada",
    });
  };

  const handleRowClick = (row: Company) => {
    setSelectedCompany(row);
    setFormData({
      name: row.name,
      ruc: row.ruc,
      address: row.address,
      phone: row.phone,
      email: row.email,
      contact: row.contact,
      status: row.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData({
      ...formData,
      status: checked ? "active" : "inactive",
    });
  };

  const handleAddCompany = () => {
    // Validate fields
    if (!formData.name || !formData.ruc || !formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete los campos obligatorios",
      });
      return;
    }

    createMutation.mutate(formData as Omit<Company, "id">);
  };

  const handleUpdateCompany = () => {
    if (!selectedCompany) return;
    
    // Validate fields
    if (!formData.name || !formData.ruc || !formData.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete los campos obligatorios",
      });
      return;
    }

    updateMutation.mutate({ id: selectedCompany.id, data: formData });
  };

  const handleDeleteCompany = () => {
    if (!selectedCompany) return;
    deleteMutation.mutate(selectedCompany.id);
  };

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ status: "active" });
    setSelectedCompany(null);
  };

  const handleCloseAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    resetForm();
    setIsEditDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Empresas"
        subtitle="Gestione las empresas en el sistema"
        showAddButton
        addButtonText="Agregar Empresa"
        onAddClick={() => setIsAddDialogOpen(true)}
      />

      <div className="mb-6">
        <DataGrid 
          data={companies}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          onRowClick={handleRowClick}
          onReload={handleReload}
        />
      </div>

      {/* Add Company Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleCloseAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Empresa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Nombre de la Empresa*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre de la empresa"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="ruc">RUC*</Label>
              <Input
                id="ruc"
                name="ruc"
                value={formData.ruc || ""}
                onChange={handleInputChange}
                placeholder="Ingrese el RUC"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Ingrese la dirección"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  placeholder="Ingrese el teléfono"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Ingrese el email"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="contact">Persona de Contacto</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact || ""}
                onChange={handleInputChange}
                placeholder="Ingrese la persona de contacto"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="status" 
                checked={formData.status === "active"}
                onCheckedChange={handleStatusChange}
              />
              <Label htmlFor="status">
                {formData.status === "active" ? "Activo" : "Inactivo"}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddDialog}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddCompany}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-name">Nombre de la Empresa*</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre de la empresa"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-ruc">RUC*</Label>
              <Input
                id="edit-ruc"
                name="ruc"
                value={formData.ruc || ""}
                onChange={handleInputChange}
                placeholder="Ingrese el RUC"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-address">Dirección</Label>
              <Textarea
                id="edit-address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Ingrese la dirección"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  placeholder="Ingrese el teléfono"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-email">Email*</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Ingrese el email"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-contact">Persona de Contacto</Label>
              <Input
                id="edit-contact"
                name="contact"
                value={formData.contact || ""}
                onChange={handleInputChange}
                placeholder="Ingrese la persona de contacto"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-status" 
                checked={formData.status === "active"}
                onCheckedChange={handleStatusChange}
              />
              <Label htmlFor="edit-status">
                {formData.status === "active" ? "Activo" : "Inactivo"}
              </Label>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => {
                handleCloseEditDialog();
                if (selectedCompany) {
                  openDeleteDialog(selectedCompany);
                }
              }}
            >
              Eliminar
            </Button>
            <div>
              <Button variant="outline" onClick={handleCloseEditDialog} className="mr-2">
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateCompany}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la empresa {selectedCompany?.name}. 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCompany}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default CompanyPage;

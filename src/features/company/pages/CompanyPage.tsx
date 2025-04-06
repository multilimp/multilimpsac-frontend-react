
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EntityDataTable } from "@/features/shared/components/EntityDataTable";
import { DataGridColumn } from "@/components/ui/data-grid";
import { 
  useCompanies, 
  useCreateCompany, 
  useUpdateCompany, 
  useDeleteCompany 
} from "../services/company.service";
import { Company } from "../models/company.model";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const CompanyPage: React.FC = () => {
  const [formData, setFormData] = useState<Partial<Company>>({
    status: "active",
  });

  const { data: companies = [], isLoading, refetch } = useCompanies();
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const breadcrumbItems = [
    {
      label: "Empresas",
      path: "/empresas",
      isCurrentPage: true
    }
  ];

  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'name', name: 'Empresa', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'contact', name: 'Contacto', type: 'string', sortable: true, filterable: true },
    { key: 'phone', name: 'Teléfono', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Email', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const renderFormContent = (data: Partial<Company>, onChange: (field: string, value: any) => void) => {
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="name">Nombre de la Empresa*</Label>
          <Input
            id="name"
            value={data.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Ingrese el nombre de la empresa"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="ruc">RUC*</Label>
          <Input
            id="ruc"
            value={data.ruc || ""}
            onChange={(e) => onChange("ruc", e.target.value)}
            placeholder="Ingrese el RUC"
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="address">Dirección</Label>
          <Textarea
            id="address"
            value={data.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Ingrese la dirección"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="Ingrese el teléfono"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="Ingrese el email"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="contact">Persona de Contacto</Label>
          <Input
            id="contact"
            value={data.contact || ""}
            onChange={(e) => onChange("contact", e.target.value)}
            placeholder="Ingrese la persona de contacto"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="status" 
            checked={data.status === "active"}
            onCheckedChange={(checked) => onChange("status", checked ? "active" : "inactive")}
          />
          <Label htmlFor="status">
            {data.status === "active" ? "Activo" : "Inactivo"}
          </Label>
        </div>
      </div>
    );
  };

  const handleSave = async (data: Partial<Company>) => {
    if (data.id) {
      await updateCompany.mutateAsync({ id: data.id, data });
    } else {
      await createCompany.mutateAsync(data as Omit<Company, 'id'>);
    }
  };

  const renderDetailPanel = (company: Company) => {
    return (
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="contacts">Contactos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Datos Generales</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="col-span-2">{company.name}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">RUC:</span>
                    <span className="col-span-2">{company.ruc}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Dirección:</span>
                    <span className="col-span-2">{company.address}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Estado:</span>
                    <span className="col-span-2">{company.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Contacto</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="col-span-2">{company.phone}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="col-span-2">{company.email}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Persona de Contacto:</span>
                    <span className="col-span-2">{company.contact}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="contacts" className="p-4">
          <div className="flex flex-col items-center justify-center p-6">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Sin contactos registrados</h3>
            <p className="text-muted-foreground">Añada contactos a esta empresa para visualizarlos aquí.</p>
          </div>
        </TabsContent>
        <TabsContent value="documents" className="p-4">
          <div className="flex flex-col items-center justify-center p-6">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Sin documentos registrados</h3>
            <p className="text-muted-foreground">Añada documentos a esta empresa para visualizarlos aquí.</p>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <DashboardLayout>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Empresas"
        subtitle="Gestione las empresas en el sistema"
      />

      <EntityDataTable<Company>
        title="Empresas"
        description="Listado de empresas registradas en el sistema"
        data={companies}
        isLoading={isLoading}
        columns={columns}
        onReload={refetch}
        renderFormContent={renderFormContent}
        renderDetailPanel={renderDetailPanel}
        onSave={handleSave}
        onDelete={deleteCompany.mutateAsync}
        addButtonText="Agregar Empresa"
        domain="company"
        permissionScope="companies"
      />
    </DashboardLayout>
  );
};

export default CompanyPage;

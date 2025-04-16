
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/common/PageHeader";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { Company } from "@/features/company/models/company.model";
import { companyService } from "../services/company.service";
import { EntityDataTable } from "@/features/shared/components/entity-data-table";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye, ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const companySchema = z.object({
  name: z.string().min(1, { message: "El nombre de la empresa es requerido" }),
  ruc: z.string().min(11, { message: "El RUC debe tener 11 dígitos" }).max(11),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email inválido" }).optional().or(z.literal('')),
  contact: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  web: z.string().optional().or(z.literal('')),
  direcciones: z.string().optional().or(z.literal('')),
  cod_unidad: z.string().optional().or(z.literal('')),
  departamento: z.string().optional().or(z.literal('')),
  provincia: z.string().optional().or(z.literal('')),
  distrito: z.string().optional().or(z.literal(''))
});

type CompanyFormData = z.infer<typeof companySchema>;

const CompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: companies = [], isLoading, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: companyService.fetchCompanies,
  });

  const breadcrumbItems = [
    {
      label: "Empresas",
      path: "/empresas",
      isCurrentPage: true
    }
  ];

  const columns = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'name', name: 'Empresa', type: 'string', sortable: true, filterable: true },
    { key: 'ruc', name: 'RUC', type: 'string', sortable: true, filterable: true },
    { key: 'contact', name: 'Contacto', type: 'string', sortable: true, filterable: true },
    { key: 'phone', name: 'Teléfono', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Email', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleViewCatalogs = (company: Company) => {
    navigate(`/empresas/${company.id}/catalogos`);
  };

  const renderDetailPanel = (company: Company) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <h3 className="text-lg font-medium">Información General</h3>
          <div className="mt-2 space-y-2">
            <div>
              <span className="font-medium">Razón Social:</span> {company.name}
            </div>
            <div>
              <span className="font-medium">RUC:</span> {company.ruc}
            </div>
            <div>
              <span className="font-medium">Estado:</span> {company.status === "active" ? "Activo" : "Inactivo"}
            </div>
            <div>
              <span className="font-medium">Teléfono:</span> {company.phone || "No registrado"}
            </div>
            <div>
              <span className="font-medium">Email:</span> {company.email || "No registrado"}
            </div>
            <div>
              <span className="font-medium">Web:</span> {company.web || "No registrado"}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium">Ubicación</h3>
          <div className="mt-2 space-y-2">
            <div>
              <span className="font-medium">Dirección:</span> {company.address || "No registrada"}
            </div>
            <div>
              <span className="font-medium">Departamento:</span> {company.departamento || "No registrado"}
            </div>
            <div>
              <span className="font-medium">Provincia:</span> {company.provincia || "No registrado"}
            </div>
            <div>
              <span className="font-medium">Distrito:</span> {company.distrito || "No registrado"}
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <Button 
            onClick={() => handleViewCatalogs(company)} 
            className="mt-4"
            variant="outline"
          >
            <ListFilter className="mr-2 h-4 w-4" />
            Ver Catálogos
          </Button>
        </div>
      </div>
    );
  };

  const renderFormContent = (data: Partial<Company>, onChange: (field: string, value: any) => void) => {
    const form = useForm<CompanyFormData>({
      resolver: zodResolver(companySchema),
      defaultValues: {
        name: data.name || '',
        ruc: data.ruc || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        contact: data.contact || '',
        status: data.status || 'active',
        web: data.web || '',
        direcciones: data.direcciones || '',
        cod_unidad: data.cod_unidad || '',
        departamento: data.departamento || '',
        provincia: data.provincia || '',
        distrito: data.distrito || ''
      }
    });

    return (
      <Form {...form}>
        <form className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón Social*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('name', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ruc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUC*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('ruc', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('email', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('phone', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="web"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio Web</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('web', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona de Contacto</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('contact', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('departamento', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="provincia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provincia</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('provincia', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="distrito"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distrito</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        onChange('distrito', e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange('address', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="direcciones"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direcciones Adicionales</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange('direcciones', e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Estado</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "active"}
                    onCheckedChange={(checked) => {
                      const value = checked ? "active" : "inactive";
                      field.onChange(value);
                      onChange('status', value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  return (
    <div>
      <BreadcrumbNav items={breadcrumbItems} />
      <EntityDataTable<Company>
        title="Empresas"
        description="Gestione las empresas en el sistema"
        data={companies}
        isLoading={isLoading}
        columns={columns}
        onReload={refetch}
        renderDetailPanel={renderDetailPanel}
        renderFormContent={renderFormContent}
        onSave={companyService.saveCompany}
        onDelete={companyService.deleteCompany}
        addButtonText="Agregar Empresa"
        domain="company"
        permissionScope="companies"
      />
    </div>
  );
};

export default CompanyPage;

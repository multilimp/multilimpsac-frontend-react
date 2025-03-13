
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable, { Column } from "@/components/common/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Company {
  id: string;
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;
  contact: string;
  status: "active" | "inactive";
}

// Mock data
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Empresa 1 S.A.C.",
    ruc: "20123456789",
    address: "Av. Principal 123, Lima",
    phone: "987654321",
    email: "contacto@empresa1.com",
    contact: "Juan Pérez",
    status: "active",
  },
  {
    id: "2",
    name: "Empresa 2 E.I.R.L.",
    ruc: "20567891234",
    address: "Jr. Secundario 456, Lima",
    phone: "987123456",
    email: "info@empresa2.com",
    contact: "María López",
    status: "active",
  },
  {
    id: "3",
    name: "Empresa 3 S.A.",
    ruc: "20654321987",
    address: "Calle Nueva 789, Lima",
    phone: "912345678",
    email: "ventas@empresa3.com",
    contact: "Pedro Gómez",
    status: "inactive",
  },
];

const CompanyPage = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    status: "active",
  });
  const { toast } = useToast();

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.ruc.includes(searchTerm) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddCompany = () => {
    // Validate fields
    if (!newCompany.name || !newCompany.ruc || !newCompany.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete los campos obligatorios",
      });
      return;
    }

    // Create new company
    const company: Company = {
      id: `${companies.length + 1}`,
      name: newCompany.name || "",
      ruc: newCompany.ruc || "",
      address: newCompany.address || "",
      phone: newCompany.phone || "",
      email: newCompany.email || "",
      contact: newCompany.contact || "",
      status: newCompany.status as "active" | "inactive" || "active",
    };

    // Add to companies
    setCompanies([...companies, company]);

    // Reset form and close dialog
    setNewCompany({ status: "active" });
    setIsAddDialogOpen(false);

    // Show toast
    toast({
      title: "Empresa agregada",
      description: "La empresa ha sido agregada correctamente",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCompany({
      ...newCompany,
      [name]: value,
    });
  };

  const handleDeleteCompany = (company: Company) => {
    setCompanies(companies.filter((c) => c.id !== company.id));
    toast({
      title: "Empresa eliminada",
      description: "La empresa ha sido eliminada correctamente",
    });
  };

  const columns: Column<Company>[] = [
    { header: "Empresa", accessorKey: "name" },
    { header: "RUC", accessorKey: "ruc" },
    { header: "Contacto", accessorKey: "contact" },
    { header: "Teléfono", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (company) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            company.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {company.status === "active" ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Empresas"
        subtitle="Gestione las empresas en el sistema"
        showAddButton
        addButtonText="Agregar Empresa"
        onAddClick={() => setIsAddDialogOpen(true)}
      />

      <div className="mb-6">
        <SearchBar
          placeholder="Buscar por nombre, RUC o email..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredCompanies}
        onDelete={handleDeleteCompany}
        onEdit={() => {}}
        onView={() => {}}
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                value={newCompany.name || ""}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre de la empresa"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="ruc">RUC*</Label>
              <Input
                id="ruc"
                name="ruc"
                value={newCompany.ruc || ""}
                onChange={handleInputChange}
                placeholder="Ingrese el RUC"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                name="address"
                value={newCompany.address || ""}
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
                  value={newCompany.phone || ""}
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
                  value={newCompany.email || ""}
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
                value={newCompany.contact || ""}
                onChange={handleInputChange}
                placeholder="Ingrese la persona de contacto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCompany}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CompanyPage;

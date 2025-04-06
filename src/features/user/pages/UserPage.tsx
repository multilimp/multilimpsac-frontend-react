
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { useToast } from "@/components/ui/use-toast";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  status: "active" | "inactive";
  lastLogin: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin Usuario",
    email: "admin@multilimp.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-15 09:30",
  },
  {
    id: "2",
    name: "Usuario Regular",
    email: "usuario@multilimp.com",
    role: "user",
    status: "active",
    lastLogin: "2023-05-14 14:20",
  },
  {
    id: "3",
    name: "Gerente Ventas",
    email: "gerente@multilimp.com",
    role: "manager",
    status: "active",
    lastLogin: "2023-05-13 16:45",
  },
  {
    id: "4",
    name: "Usuario Inactivo",
    email: "inactivo@multilimp.com",
    role: "user",
    status: "inactive",
    lastLogin: "2023-04-28 10:15",
  },
];

const UserPage: React.FC = () => {
  const [users] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const breadcrumbItems = [
    {
      label: "Usuarios",
      path: "/usuarios",
      isCurrentPage: true
    }
  ];

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "manager":
        return "Gerente";
      case "user":
        return "Usuario";
      default:
        return role;
    }
  };

  const columns: DataGridColumn[] = [
    { key: 'id', name: 'ID', type: 'string', sortable: true, filterable: true },
    { key: 'name', name: 'Nombre', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Email', type: 'string', sortable: true, filterable: true },
    { key: 'role', name: 'Rol', type: 'string', sortable: true, filterable: true },
    { key: 'lastLogin', name: 'Último acceso', type: 'string', sortable: true, filterable: true },
    { key: 'status', name: 'Estado', type: 'string', sortable: true, filterable: true },
  ];

  const handleReload = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Datos actualizados",
        description: "La lista de usuarios ha sido actualizada",
      });
    }, 1000);
  };

  const handleRowClick = (row: User) => {
    console.log('Usuario seleccionado:', row);
    toast({
      title: "Usuario seleccionado",
      description: `${row.name} (${getRoleName(row.role)})`,
    });
  };

  return (
    <DashboardLayout>
      <BreadcrumbNav items={breadcrumbItems} />
      <PageHeader
        title="Usuarios"
        subtitle="Gestione los usuarios del sistema"
        showAddButton
        addButtonText="Agregar Usuario"
      />
      
      <div className="mb-6">
        <DataGrid 
          data={users}
          columns={columns}
          loading={loading}
          pageSize={10}
          onRowClick={handleRowClick}
          onReload={handleReload}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserPage;


import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable, { Column } from "@/components/common/DataTable";
import { useToast } from "@/components/ui/use-toast";

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

const UserPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleDeleteUser = (user: User) => {
    setUsers(users.filter((u) => u.id !== user.id));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente",
    });
  };

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

  const columns: Column<User>[] = [
    { header: "Nombre", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { 
      header: "Rol", 
      accessorKey: "role",
      cell: (user) => getRoleName(user.role)
    },
    { header: "Último acceso", accessorKey: "lastLogin" },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {user.status === "active" ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Usuarios"
        subtitle="Gestione los usuarios del sistema"
        showAddButton
        addButtonText="Agregar Usuario"
      />

      <div className="mb-6">
        <SearchBar
          placeholder="Buscar por nombre, email o rol..."
          onChange={handleSearch}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        onDelete={handleDeleteUser}
        onEdit={() => {}}
        onView={() => {}}
      />
    </DashboardLayout>
  );
};

export default UserPage;

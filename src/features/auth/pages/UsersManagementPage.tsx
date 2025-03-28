
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { RequirePermission } from "@/core/utils/permissions";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";

// Esquema de validación para crear usuarios
const createUserSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Ingrese un correo electrónico válido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  role: z.enum(["admin", "user", "manager"], { message: "Seleccione un rol válido" }),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

// Interfaz para los usuarios mostrados en la tabla
interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const UsersManagementPage = () => {
  const { createUser, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  // Cargar la lista de usuarios
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, role, created_at, email:auth.users(email)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transformar los datos para la tabla
      const formattedData = data.map((item) => ({
        id: item.id,
        name: item.name || "Sin nombre",
        email: item.email?.[0]?.email || "Sin correo",
        role: item.role,
        created_at: new Date(item.created_at).toLocaleDateString(),
      }));

      setUsers(formattedData);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar usuarios",
        description: "No se pudieron cargar los usuarios. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSubmit = async (values: CreateUserFormValues) => {
    setIsSubmitting(true);
    try {
      await createUser(values.email, values.password, values.name, values.role);
      form.reset();
      setIsOpen(false);
      loadUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al crear usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: DataGridColumn[] = [
    { key: 'name', name: 'Nombre', type: 'string', sortable: true, filterable: true },
    { key: 'email', name: 'Correo', type: 'string', sortable: true, filterable: true },
    { key: 'role', name: 'Rol', type: 'string', sortable: true, filterable: true },
    { key: 'created_at', name: 'Fecha de creación', type: 'string', sortable: true, filterable: true },
  ];

  const renderRoleName = (role: string) => {
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

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <RequirePermission permission="manage_users" fallback={
          <Card>
            <CardHeader>
              <CardTitle>Acceso denegado</CardTitle>
              <CardDescription>
                No tienes permisos para administrar usuarios.
              </CardDescription>
            </CardHeader>
          </Card>
        }>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Administración de Usuarios</h1>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Crear Usuario</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear nuevo usuario</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para crear un nuevo usuario en el sistema.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del usuario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input placeholder="correo@ejemplo.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input placeholder="******" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rol</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un rol" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="user">Usuario</SelectItem>
                              <SelectItem value="manager">Gerente</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creando..." : "Crear usuario"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usuarios del sistema</CardTitle>
              <CardDescription>
                Listado de todos los usuarios registrados en el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataGrid
                data={users}
                columns={columns}
                loading={loading}
                pageSize={10}
                onReload={loadUsers}
              />
            </CardContent>
          </Card>
        </RequirePermission>
      </div>
    </DashboardLayout>
  );
};

export default UsersManagementPage;


import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

type ProfileFormValues = {
  name: string;
  email: string;
};

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, this would update the user profile
    // For now, just show a toast
    toast({
      title: "Perfil actualizado",
      description: "Los datos de su perfil han sido actualizados correctamente",
    });
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfil de Usuario</h1>
          <p className="text-muted-foreground">
            Gestione su información de perfil y preferencias
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualice la información de su perfil de usuario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-lg bg-multilimp-green text-white">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rol: {user.role === "admin" ? "Administrador" : "Usuario"}
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly />
                        </FormControl>
                        <FormDescription>
                          El correo electrónico no puede ser modificado
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-multilimp-green hover:bg-multilimp-green-dark">
                    Guardar Cambios
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>
                Actualice su contraseña y ajustes de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Cambiar Contraseña</h3>
                <div className="grid gap-2">
                  <Input type="password" placeholder="Contraseña actual" />
                  <Input type="password" placeholder="Nueva contraseña" />
                  <Input type="password" placeholder="Confirmar nueva contraseña" />
                </div>
                <Button variant="outline" className="mt-2">
                  Actualizar Contraseña
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-medium">Sesiones Activas</h3>
                <p className="text-sm text-muted-foreground">
                  Estación de trabajo actual (Navegador web)
                </p>
                <Button variant="destructive" size="sm" className="mt-2">
                  Cerrar todas las sesiones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;

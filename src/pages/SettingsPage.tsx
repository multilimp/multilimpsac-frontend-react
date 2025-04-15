
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente",
    });
  };

  return (
    <div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Gestione las preferencias y configuración del sistema
          </p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Apariencia</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración General</CardTitle>
                <CardDescription>
                  Preferencias generales del sistema ERP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="language">Idioma</Label>
                      <div className="text-sm text-muted-foreground">
                        Seleccione el idioma de la interfaz
                      </div>
                    </div>
                    <Select defaultValue="es">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Formato de fecha</Label>
                      <div className="text-sm text-muted-foreground">
                        Formato para mostrar fechas
                      </div>
                    </div>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Switch id="auto-logout" />
                    <Label htmlFor="auto-logout">Cierre de sesión automático después de 30 minutos</Label>
                  </div>
                </div>

                <Button className="bg-multilimp-green hover:bg-multilimp-green-dark" onClick={handleSave}>
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                  Personalice la apariencia de la interfaz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tema</Label>
                      <div className="text-sm text-muted-foreground">
                        Seleccione el tema de la interfaz
                      </div>
                    </div>
                    <Select defaultValue="light">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="compact-mode" />
                    <Label htmlFor="compact-mode">Modo compacto para tablas</Label>
                  </div>
                </div>

                <Button className="bg-multilimp-green hover:bg-multilimp-green-dark" onClick={handleSave}>
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Configure sus preferencias de notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="email-notifications" defaultChecked />
                    <Label htmlFor="email-notifications">Notificaciones por correo electrónico</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="quote-notifications" defaultChecked />
                    <Label htmlFor="quote-notifications">Notificaciones de cotizaciones</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="order-notifications" defaultChecked />
                    <Label htmlFor="order-notifications">Notificaciones de órdenes</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="collection-notifications" defaultChecked />
                    <Label htmlFor="collection-notifications">Notificaciones de cobranzas</Label>
                  </div>
                </div>

                <Button className="bg-multilimp-green hover:bg-multilimp-green-dark" onClick={handleSave}>
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;

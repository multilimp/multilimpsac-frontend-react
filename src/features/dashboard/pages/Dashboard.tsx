
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { 
  Users, Building, Package, FileText, 
  TrendingUp, TrendingDown, BarChart3, 
  DollarSign, ShoppingCart 
} from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="analytics">Analíticas</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Ventas Totales"
                  value="S/ 45,231.89"
                  description="+20.1% del mes anterior"
                  icon={DollarSign}
                  trend="up"
                />
                <StatCard
                  title="Nuevos Clientes"
                  value="12"
                  description="+5 desde la semana pasada"
                  icon={Users}
                  trend="up"
                />
                <StatCard
                  title="Órdenes Pendientes"
                  value="23"
                  description="4 con entrega hoy"
                  icon={Package}
                  trend="neutral"
                />
                <StatCard
                  title="Cotizaciones"
                  value="8"
                  description="-2 desde la semana pasada"
                  icon={FileText}
                  trend="down"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Resumen de Ventas</CardTitle>
                    <CardDescription>
                      Comparación de ventas mensuales
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DashboardChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>
                      Últimas transacciones y actividades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Lista de actividades recientes */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="mr-4 bg-blue-100 p-2 rounded-full">
                          <ShoppingCart className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Nueva orden #1234</p>
                          <p className="text-xs text-gray-500">Hace 35 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 bg-green-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Nuevo cliente registrado</p>
                          <p className="text-xs text-gray-500">Hace 2 horas</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 bg-amber-100 p-2 rounded-full">
                          <FileText className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Cotización aprobada</p>
                          <p className="text-xs text-gray-500">Hace 3 horas</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Productos Principales
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {/* Tabla de productos */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Detergente Industrial</span>
                        <span className="font-medium">142 unidades</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Desinfectante</span>
                        <span className="font-medium">98 unidades</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Jabón Líquido</span>
                        <span className="font-medium">76 unidades</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Clientes Destacados
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {/* Lista de clientes */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Hotel Costa Verde</span>
                        <span className="font-medium">S/ 12,450</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Clínica San Pablo</span>
                        <span className="font-medium">S/ 8,320</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Oficinas Miraflores</span>
                        <span className="font-medium">S/ 5,680</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Rendimiento
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {/* Métricas de rendimiento */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tasa de conversión</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tiempo de entrega</span>
                        <span className="font-medium">2.3 días</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Satisfacción</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              {/* Contenido de Reportes */}
              <Card>
                <CardHeader>
                  <CardTitle>Reportes Disponibles</CardTitle>
                  <CardDescription>
                    Seleccione un reporte para visualizar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <BarChart3 className="h-8 w-8 mb-2 text-blue-500" />
                      <p className="font-medium">Ventas por Período</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Users className="h-8 w-8 mb-2 text-green-500" />
                      <p className="font-medium">Clientes por Zona</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Package className="h-8 w-8 mb-2 text-amber-500" />
                      <p className="font-medium">Inventario</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Building className="h-8 w-8 mb-2 text-purple-500" />
                      <p className="font-medium">Rendimiento por Sede</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <TrendingDown className="h-8 w-8 mb-2 text-red-500" />
                      <p className="font-medium">Análisis de Gastos</p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <ShoppingCart className="h-8 w-8 mb-2 text-indigo-500" />
                      <p className="font-medium">Órdenes Mensuales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

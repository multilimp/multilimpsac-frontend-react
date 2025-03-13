
import React from "react";
import { 
  BarChart3, 
  ShoppingCart, 
  FileSearch, 
  Package, 
  TrendingUp, 
  Calendar, 
  DollarSign 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import DashboardChart from "@/components/dashboard/DashboardChart";
import { useAuth } from "@/contexts/AuthContext";

// Mock data
const salesData = [
  { name: "Ene", value: 40000 },
  { name: "Feb", value: 35000 },
  { name: "Mar", value: 50000 },
  { name: "Abr", value: 45000 },
  { name: "May", value: 60000 },
  { name: "Jun", value: 55000 },
  { name: "Jul", value: 70000 },
];

const quotesData = [
  { name: "Ene", value: 30 },
  { name: "Feb", value: 28 },
  { name: "Mar", value: 45 },
  { name: "Abr", value: 40 },
  { name: "May", value: 55 },
  { name: "Jun", value: 50 },
  { name: "Jul", value: 65 },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">¡Bienvenido, {user?.name}!</h1>
          <p className="text-muted-foreground">Aquí tiene un resumen de sus actividades recientes y estadísticas.</p>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Ventas del mes"
            value="S/ 70,500"
            icon={<DollarSign />}
            trend={12}
          />
          <StatCard
            title="Cotizaciones"
            value="65"
            icon={<FileSearch />}
            trend={8}
          />
          <StatCard
            title="Órdenes de Compra"
            value="42"
            icon={<Package />}
            trend={-3}
          />
          <StatCard
            title="Entregas Pendientes"
            value="18"
            icon={<ShoppingCart />}
            trend={5}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <DashboardChart 
            title="Ventas en los últimos meses" 
            data={salesData} 
          />
          <DashboardChart 
            title="Cotizaciones en los últimos meses" 
            data={quotesData} 
          />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Actividad Reciente</CardTitle>
              <CardDescription>Últimas actividades registradas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="bg-multilimp-green/10 p-2 rounded-full">
                      {i === 1 ? (
                        <ShoppingCart className="h-5 w-5 text-multilimp-green" />
                      ) : i === 2 ? (
                        <FileSearch className="h-5 w-5 text-multilimp-green" />
                      ) : (
                        <Package className="h-5 w-5 text-multilimp-green" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {i === 1
                          ? "Nueva venta registrada"
                          : i === 2
                          ? "Cotización aprobada"
                          : "Orden de compra creada"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1
                          ? "Cliente: Empresa ABC S.A.C."
                          : i === 2
                          ? "Cliente: Corporación XYZ"
                          : "Proveedor: Suministros Industriales"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1 ? "Hace 2 horas" : i === 2 ? "Hace 4 horas" : "Hace 5 horas"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Próximos Eventos</CardTitle>
              <CardDescription>Eventos programados en los próximos días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="bg-multilimp-green/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-multilimp-green" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {i === 1
                          ? "Entrega de productos"
                          : i === 2
                          ? "Reunión con proveedor"
                          : "Pago de facturas"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1
                          ? "Cliente: Distribuidora Norte"
                          : i === 2
                          ? "Proveedor: Importadora Global"
                          : "Varios proveedores"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i === 1 ? "Mañana, 10:00 AM" : i === 2 ? "22/05/2023, 2:30 PM" : "25/05/2023, 9:00 AM"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;


import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DashboardChart from '@/components/dashboard/DashboardChart';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, FileSearch, Package, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Sample data for charts
  const salesData = [
    { name: "Ene", value: 40000 },
    { name: "Feb", value: 35000 },
    { name: "Mar", value: 50000 },
    { name: "Abr", value: 45000 },
    { name: "May", value: 60000 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de control"
        subtitle="Resumen de datos y análisis"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Cotizaciones" 
          value="24" 
          trend={12}
          icon={<FileSearch />}
          description="desde el mes pasado"
        />
        <StatCard 
          title="Ventas" 
          value="$14,832" 
          trend={8}
          icon={<BarChart3 />} 
          description="desde el mes pasado"
        />
        <StatCard 
          title="Órdenes" 
          value="18" 
          trend={-3} 
          icon={<Package />}
          description="desde el mes pasado" 
        />
        <StatCard 
          title="Ingresos" 
          value="$23,558" 
          trend={10} 
          icon={<DollarSign />}
          description="desde el mes pasado"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Ventas mensuales</h3>
            <DashboardChart 
              title="Ventas mensuales" 
              data={salesData} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Distribución de órdenes</h3>
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Gráfico de distribución
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import DashboardChart from '@/components/dashboard/DashboardChart';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de control"
        description="Resumen de datos y análisis"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Cotizaciones" 
          value="24" 
          trend="+12%" 
          status="up" 
        />
        <StatCard 
          title="Ventas" 
          value="$14,832" 
          trend="+8%" 
          status="up" 
        />
        <StatCard 
          title="Órdenes" 
          value="18" 
          trend="-3%" 
          status="down" 
        />
        <StatCard 
          title="Ingresos" 
          value="$23,558" 
          trend="+10%" 
          status="up" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Ventas mensuales</h3>
            <DashboardChart />
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

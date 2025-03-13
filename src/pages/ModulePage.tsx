
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ModulePageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ModulePage: React.FC<ModulePageProps> = ({ title, description, icon }) => {
  return (
    <DashboardLayout>
      <PageHeader
        title={title}
        subtitle={description}
        showAddButton
        addButtonText={`Agregar ${title}`}
      />

      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex justify-center">
              <div className="bg-multilimp-green/10 p-4 rounded-full">
                {icon}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">Módulo en Desarrollo</h3>
            <CardDescription>
              Esta funcionalidad estará disponible próximamente.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ModulePage;

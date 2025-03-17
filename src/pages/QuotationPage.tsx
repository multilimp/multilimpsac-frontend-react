
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Search, Filter, FileDown } from "lucide-react";
import { format } from "date-fns";

import { Client } from "@/data/models";
import { Quotation } from "@/data/models/quotation";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/common/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RequirePermission } from "@/core/utils/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuotationForm from "@/components/quotations/QuotationForm";
import QuotationList from "@/components/quotations/QuotationList";
import { useAuthStore } from "@/store/authStore";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";

const QuotationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("list");
  const { user } = useAuthStore();

  // Custom breadcrumb items for the Quotation page
  const breadcrumbItems = [
    {
      label: "Cotizaciones",
      path: "/cotizaciones",
      isCurrentPage: true
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <RequirePermission permission="manage_quotes">
        <BreadcrumbNav items={breadcrumbItems} />
        <PageHeader 
          title="Gestión de Cotizaciones" 
          subtitle="Administre las cotizaciones para sus clientes"
        />

        <Card>
          <CardHeader>
            <Tabs 
              defaultValue="list" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="list">Listado</TabsTrigger>
                  <TabsTrigger value="new">Nueva Cotización</TabsTrigger>
                </TabsList>
                {activeTab === "list" && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Buscar cotización..."
                        className="pl-9 w-[250px]"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setActiveTab("new")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Cotización
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <TabsContent value="list" className="m-0">
                  <QuotationList />
                </TabsContent>
                <TabsContent value="new" className="m-0">
                  <QuotationForm onSuccess={() => setActiveTab("list")} />
                </TabsContent>
              </div>
            </Tabs>
          </CardHeader>
        </Card>
      </RequirePermission>
    </div>
  );
};

export default QuotationPage;

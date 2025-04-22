import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Pencil, Users, Plus } from 'lucide-react';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { useToast } from '@/hooks/use-toast';
import { useSupplier, useDeleteSupplier } from '../services/supplier.service';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SupplierDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { data: supplier, isLoading, error } = useSupplier(id || '');
  const deleteMutation = useDeleteSupplier();
  
  const breadcrumbItems = [
    {
      label: "Proveedores",
      path: "/proveedores",
    },
    {
      label: supplier?.name || "Detalle",
      path: `/proveedores/${id}`,
      isCurrentPage: true
    }
  ];
  
  const handleBackClick = () => {
    navigate('/proveedores');
  };
  
  const handleEditClick = () => {
    navigate(`/proveedores/${id}/edit`);
  };
  
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id || '');
      toast({
        title: "Proveedor eliminado",
        description: "El proveedor ha sido eliminado exitosamente"
      });
      navigate('/proveedores');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el proveedor: ${error.message}`
      });
    }
  };
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  if (error || !supplier) {
    return (
      <div className="p-4">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {(error as Error)?.message || "No se pudo cargar el proveedor"}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Proveedores
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Proveedores
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Building2 className="mr-2 h-6 w-6 text-muted-foreground" />
            {supplier.name}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditClick}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Eliminar
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="contacts">Contactos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Razón Social</p>
                    <p className="font-medium">{supplier.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">RUC</p>
                    <p>{supplier.ruc}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Estado</p>
                    <p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {supplier.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Dirección</p>
                    <p>{supplier.address || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Departamento</p>
                    <p>{supplier.department || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Provincia</p>
                    <p>{supplier.province || "—"}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground text-sm">Distrito</p>
                    <p>{supplier.district || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Users className="mr-2 h-5 w-5 text-muted-foreground" />
              Contactos
            </h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Contacto
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-center py-8">
                No hay contactos asociados a este proveedor.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el proveedor
              y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SupplierDetailsPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import TableEmptyState from '@/components/common/TableEmptyState';
import TableActions from '@/components/common/TableActions';
import { Company, CompanyCatalog } from '../models/company.model';
import { useCompany, useCompanyCatalogs, useCreateCompanyCatalog, useUpdateCompanyCatalog, useDeleteCompanyCatalog } from '../index';

const CompanyCatalogsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<CompanyCatalog | null>(null);
  const [newCatalogCode, setNewCatalogCode] = useState('');

  // Get company
  const { data: company, isLoading: isLoadingCompany } = useCompany(id || '');
  
  // Get catalogs
  const { 
    data: catalogs = [], 
    isLoading: isLoadingCatalogs,
    refetch: refetchCatalogs
  } = useCompanyCatalogs(id || '');

  // Mutations
  const { mutateAsync: createCatalog, isPending: isCreating } = useCreateCompanyCatalog();
  const { mutateAsync: updateCatalog, isPending: isUpdating } = useUpdateCompanyCatalog();
  const { mutateAsync: deleteCatalog, isPending: isDeleting } = useDeleteCompanyCatalog();

  // Handlers
  const handleCreateCatalog = async () => {
    if (!newCatalogCode.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El código del catálogo no puede estar vacío"
      });
      return;
    }

    try {
      await createCatalog({
        empresaId: id || '',
        codigo: newCatalogCode,
      });
      
      setNewCatalogCode('');
      setIsAddDialogOpen(false);
      refetchCatalogs();
      
      toast({
        title: "Catálogo creado",
        description: "El catálogo ha sido creado exitosamente"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el catálogo"
      });
    }
  };

  const handleUpdateCatalog = async () => {
    if (!selectedCatalog) return;
    
    try {
      await updateCatalog({ 
        id: selectedCatalog.id, 
        data: selectedCatalog 
      });
      
      setSelectedCatalog(null);
      setIsEditDialogOpen(false);
      refetchCatalogs();
      
      toast({
        title: "Catálogo actualizado",
        description: "El catálogo ha sido actualizado exitosamente"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el catálogo"
      });
    }
  };

  const handleDeleteCatalog = async () => {
    if (!selectedCatalog) return;
    
    try {
      await deleteCatalog(selectedCatalog.id);
      setSelectedCatalog(null);
      setIsDeleteDialogOpen(false);
      refetchCatalogs();
      
      toast({
        title: "Catálogo eliminado",
        description: "El catálogo ha sido eliminado exitosamente"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el catálogo"
      });
    }
  };

  if (isLoadingCompany) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Cargando...</h1>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Empresa no encontrada</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">Catálogos - {company.razonSocial}</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Catálogos disponibles</CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Catálogo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingCatalogs ? (
            <div className="flex justify-center p-6">
              <p>Cargando catálogos...</p>
            </div>
          ) : catalogs.length === 0 ? (
            <TableEmptyState 
              title="No hay catálogos" 
              description={`No hay catálogos registrados para ${company.razonSocial}`} 
              action={
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Catálogo
                </Button>
              }
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogs.map(catalog => (
                    <TableRow key={catalog.id}>
                      <TableCell>{catalog.id}</TableCell>
                      <TableCell>{catalog.codigo}</TableCell>
                      <TableCell>
                        <TableActions
                          row={catalog}
                          onView={false}
                          onEdit={() => {
                            setSelectedCatalog(catalog);
                            setIsEditDialogOpen(true);
                          }}
                          onDelete={() => {
                            setSelectedCatalog(catalog);
                            setIsDeleteDialogOpen(true);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Catalog Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Catálogo para {company.razonSocial}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código del Catálogo</Label>
              <Input
                id="code"
                value={newCatalogCode}
                onChange={(e) => setNewCatalogCode(e.target.value)}
                placeholder="Ingrese el código del catálogo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setNewCatalogCode('');
                setIsAddDialogOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateCatalog}
              disabled={isCreating || !newCatalogCode.trim()}
            >
              {isCreating ? 'Creando...' : 'Crear Catálogo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Catalog Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Catálogo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Código del Catálogo</Label>
              <Input
                id="edit-code"
                value={selectedCatalog?.codigo || ''}
                onChange={(e) => 
                  setSelectedCatalog(selectedCatalog ? 
                    { ...selectedCatalog, codigo: e.target.value } : null
                  )
                }
                placeholder="Ingrese el código del catálogo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCatalog(null);
                setIsEditDialogOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateCatalog}
              disabled={isUpdating || !selectedCatalog?.codigo?.trim()}
            >
              {isUpdating ? 'Actualizando...' : 'Actualizar Catálogo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Está seguro que desea eliminar el catálogo con código <strong>{selectedCatalog?.codigo}</strong>?</p>
            <p className="text-muted-foreground mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCatalog(null);
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCatalog}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Catálogo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyCatalogsPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  useCompany,
  useCompanyCatalogs,
  useCreateCompanyCatalog,
  useDeleteCompanyCatalog
} from '../index';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import PageWithSecondaryNav from '@/components/layout/PageWithSecondaryNav';
import SecondaryNavWrapper from '@/components/layout/SecondaryNavWrapper';

const CompanyCatalogsPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: company, isLoading: isCompanyLoading, error: companyError } = useCompany(companyId || '');
  const { data: catalogs, isLoading: isCatalogsLoading, error: catalogsError } = useCompanyCatalogs(companyId || '');
  const { mutate: createCatalog, isLoading: isCreating } = useCreateCompanyCatalog();
  const { mutate: deleteCatalog, isLoading: isDeleting } = useDeleteCompanyCatalog();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatalogCode, setNewCatalogCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (companyError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo cargar la empresa: ${companyError.message}`
      });
    }
    if (catalogsError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudieron cargar los catálogos: ${catalogsError.message}`
      });
    }
  }, [companyError, catalogsError, toast]);
  
  const navItems = [
    { 
      label: "Catálogos", 
      path: `/empresas/${companyId}/catalogos`
    }
  ];
  
  const handleBackClick = () => {
    navigate('/empresas');
  };

  // Fix the empresa_id to empresaId conversion when creating a catalog
  const handleAddCatalog = async () => {
    setIsLoading(true);
    try {
      await createCatalog({
        empresaId: companyId, // Change from empresa_id to empresaId
        codigo: newCatalogCode
      });
      setNewCatalogCode('');
      setIsAddModalOpen(false);
      toast({
        title: "Catálogo creado",
        description: "El catálogo ha sido creado exitosamente"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo crear el catálogo: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteCatalog = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteCatalog(id);
      toast({
        title: "Catálogo eliminado",
        description: "El catálogo ha sido eliminado exitosamente"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudo eliminar el catálogo: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isCompanyLoading) {
    return (
      <PageWithSecondaryNav>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Cargando datos de la empresa...</p>
        </div>
      </PageWithSecondaryNav>
    );
  }
  
  if (!company) {
    return (
      <PageWithSecondaryNav>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-destructive">Error al cargar los datos de la empresa</p>
          <Button variant="outline" onClick={handleBackClick} className="mt-4">
            Volver a la lista
          </Button>
        </div>
      </PageWithSecondaryNav>
    );
  }
  
  return (
    <SecondaryNavWrapper navItems={navItems} title="Catálogos de Empresa">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Empresas
            </Button>
            <h1 className="text-2xl font-bold">
              Catálogos de {company?.razonSocial || company?.name}
            </h1>
          </div>
          
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Catálogo
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCatalogsLoading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Cargando catálogos...
                  </TableCell>
                </TableRow>
              ) : (
                catalogs?.map((catalog) => (
                  <TableRow key={catalog.id}>
                    <TableCell>{catalog.codigo}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCatalog(catalog.id)}
                        disabled={isDeleting}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nuevo Catálogo</DialogTitle>
              <DialogDescription>
                Ingrese el código para el nuevo catálogo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="code" className="text-right">
                  Código
                </label>
                <Input 
                  id="code" 
                  value={newCatalogCode} 
                  onChange={(e) => setNewCatalogCode(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={handleAddCatalog} disabled={isCreating || isLoading}>
                {isCreating || isLoading ? 'Creando...' : 'Crear Catálogo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SecondaryNavWrapper>
  );
};

export default CompanyCatalogsPage;

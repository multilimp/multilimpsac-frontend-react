
import React, { useState } from 'react';
import { 
  DataGrid, 
  DataGridColumn 
} from '@/components/ui/data-grid';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export interface EntityDataTableProps<T extends { id: string }> {
  title: string;
  description?: string;
  data: T[];
  isLoading: boolean;
  columns: DataGridColumn[];
  onRowClick?: (row: T) => void;
  onReload?: () => void;
  onDelete?: (id: string) => Promise<void>;
  renderDetailPanel?: (row: T) => React.ReactNode;
  renderFormContent?: (data: Partial<T>, onChange: (field: string, value: any) => void) => React.ReactNode;
  onSave?: (data: Partial<T>) => Promise<void>;
  addButtonText?: string;
  domain: string;
  permissionScope: string;
}

export function EntityDataTable<T extends { id: string; name: string }>(
  props: EntityDataTableProps<T>
) {
  const {
    title,
    description,
    data,
    isLoading,
    columns,
    onRowClick,
    onReload,
    onDelete,
    renderDetailPanel,
    renderFormContent,
    onSave,
    addButtonText = "Agregar",
    domain,
    permissionScope
  } = props;

  const [selectedEntity, setSelectedEntity] = useState<T | null>(null);
  const [formData, setFormData] = useState<Partial<T>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  const { toast } = useToast();

  const handleRowClick = (row: T) => {
    setSelectedEntity(row);
    if (onRowClick) {
      onRowClick(row);
    } else {
      setIsEditDialogOpen(true);
    }
  };

  const handleAddClick = () => {
    setFormData({});
    setIsAddDialogOpen(true);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!onSave) return;

    try {
      await onSave(formData);
      toast({
        title: "Éxito",
        description: `${selectedEntity ? "Actualizado" : "Creado"} correctamente`,
      });
      closeAllDialogs();
      if (onReload) onReload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error",
      });
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !selectedEntity) return;

    try {
      await onDelete(selectedEntity.id);
      toast({
        title: "Éxito",
        description: "Eliminado correctamente",
      });
      setIsDeleteDialogOpen(false);
      if (onReload) onReload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Ha ocurrido un error al eliminar",
      });
    }
  };

  const closeAllDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setIsDetailExpanded(false);
    setSelectedEntity(null);
    setFormData({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        
        {renderFormContent && onSave && (
          <Button onClick={handleAddClick}>{addButtonText}</Button>
        )}
      </div>

      <div className="rounded-md border bg-card">
        <DataGrid
          data={data}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          onRowClick={handleRowClick}
          onReload={onReload}
        />
      </div>

      {renderDetailPanel && selectedEntity && (
        <Dialog open={isDetailExpanded} onOpenChange={setIsDetailExpanded}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalle de {selectedEntity.name}</DialogTitle>
            </DialogHeader>
            {renderDetailPanel(selectedEntity)}
          </DialogContent>
        </Dialog>
      )}

      {renderFormContent && onSave && (
        <>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Agregar {title}</DialogTitle>
              </DialogHeader>
              {renderFormContent(formData, handleFieldChange)}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Guardar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar {title}</DialogTitle>
              </DialogHeader>
              {renderFormContent(
                selectedEntity ? { ...selectedEntity, ...formData } : formData,
                handleFieldChange
              )}
              <DialogFooter className="flex justify-between">
                {onDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    Eliminar
                  </Button>
                )}
                <div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="mr-2"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Guardar</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {onDelete && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente {selectedEntity?.name}.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

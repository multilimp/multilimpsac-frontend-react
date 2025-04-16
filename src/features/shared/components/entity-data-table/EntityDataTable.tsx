
import React, { useState } from 'react';
import { 
  DataGrid, 
  DataGridColumn 
} from '@/components/ui/data-grid';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { EntityFormDialog } from './EntityFormDialog';
import { EntityDetailDialog } from './EntityDetailDialog';
import { EntityDeleteDialog } from './EntityDeleteDialog';
import { EntityDataTableProps } from './types';

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

      {/* Detail Panel Dialog */}
      {renderDetailPanel && (
        <EntityDetailDialog
          isOpen={isDetailExpanded}
          onOpenChange={setIsDetailExpanded}
          entity={selectedEntity}
          renderDetailPanel={renderDetailPanel}
        />
      )}

      {/* Add/Edit Form Dialogs */}
      {renderFormContent && onSave && (
        <>
          <EntityFormDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            title={title}
            selectedEntity={null}
            formData={formData}
            renderFormContent={renderFormContent}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
            isAdd={true}
          />

          <EntityFormDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            title={title}
            selectedEntity={selectedEntity}
            formData={formData}
            renderFormContent={renderFormContent}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
            onDelete={() => {
              setIsEditDialogOpen(false);
              setIsDeleteDialogOpen(true);
            }}
            isAdd={false}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {onDelete && (
        <EntityDeleteDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          entity={selectedEntity}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}


import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EntityFormDialogProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  selectedEntity: T | null;
  formData: Partial<T>;
  renderFormContent: (data: Partial<T>, onChange: (field: string, value: any) => void) => React.ReactNode;
  onFieldChange: (field: string, value: any) => void;
  onSave: () => Promise<void>;
  onDelete?: () => void;
  isAdd: boolean;
}

export function EntityFormDialog<T extends { id: string; name: string }>({
  isOpen,
  onOpenChange,
  title,
  selectedEntity,
  formData,
  renderFormContent,
  onFieldChange,
  onSave,
  onDelete,
  isAdd
}: EntityFormDialogProps<T>) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isAdd ? `Agregar ${title}` : `Editar ${title}`}</DialogTitle>
        </DialogHeader>
        {renderFormContent(
          selectedEntity ? { ...selectedEntity, ...formData } : formData,
          onFieldChange
        )}
        <DialogFooter className="flex justify-between">
          {!isAdd && onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
            >
              Eliminar
            </Button>
          )}
          <div>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button onClick={onSave}>Guardar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

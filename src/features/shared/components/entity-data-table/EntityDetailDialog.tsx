
import React from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface EntityDetailDialogProps<T> {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  entity: T | null;
  renderDetailPanel: (row: T) => React.ReactNode;
}

export function EntityDetailDialog<T extends { id: string; name: string }>({
  isOpen,
  onOpenChange,
  entity,
  renderDetailPanel
}: EntityDetailDialogProps<T>) {
  if (!entity) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalle de {entity.name}</DialogTitle>
        </DialogHeader>
        {renderDetailPanel(entity)}
      </DialogContent>
    </Dialog>
  );
}

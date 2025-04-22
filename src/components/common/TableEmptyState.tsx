
import React, { ReactNode } from 'react';
import { LucideIcon, FolderX } from 'lucide-react';

interface TableEmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  title = "No hay datos",
  description = "No hay registros disponibles para mostrar.",
  icon: Icon = FolderX,
  action,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default TableEmptyState;

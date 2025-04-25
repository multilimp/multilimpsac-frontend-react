
import React from 'react';
import { Button } from '@/components/ui/button';
import { InboxIcon } from 'lucide-react';

export interface TableEmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  colSpan?: number;
  loading?: boolean;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  title,
  description,
  action,
  className = '',
  colSpan,
  loading = false
}) => {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground text-sm">Cargando...</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="bg-muted rounded-full p-3 mb-4">
        <InboxIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default TableEmptyState;

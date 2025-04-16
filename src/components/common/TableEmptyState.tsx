
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

interface TableEmptyStateProps {
  title?: string;
  description?: string;
  colSpan?: number;
  loading?: boolean;
  className?: string;
  action?: React.ReactNode;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({ 
  title = "No hay datos disponibles", 
  description, 
  colSpan = 6,
  loading = false,
  className = "",
  action
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <h3 className="text-lg font-medium">{loading ? "Cargando datos..." : title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default TableEmptyState;

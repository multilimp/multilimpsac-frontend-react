
import React from 'react';

export interface TableEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  colSpan?: number;
  loading?: boolean;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  title = "No data available",
  description = "No records found.",
  action,
  className = "",
  colSpan,
  loading = false
}) => {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="h-24 text-center">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        </td>
      </tr>
    );
  }
  
  return (
    <tr>
      <td colSpan={colSpan} className={`h-24 text-center ${className}`}>
        <div className="flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {action && <div className="mt-4">{action}</div>}
        </div>
      </td>
    </tr>
  );
};

export default TableEmptyState;

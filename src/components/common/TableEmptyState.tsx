
import React from 'react';
import { InboxIcon } from 'lucide-react';

export interface TableEmptyStateProps {
  title?: string;
  message?: string;
  description?: string; // Added for backward compatibility
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  colSpan?: number; // Added for DataTable
  loading?: boolean; // Added for DataTable loading state
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  title = 'No hay datos',
  message = 'No se encontraron registros para mostrar.',
  description, // Support both message and description for backward compatibility
  icon = <InboxIcon className="h-10 w-10 text-gray-400" />,
  className = '',
  action,
  loading = false,
  colSpan
}) => {
  // Use description as fallback if message is not provided
  const displayMessage = message || description || 'No se encontraron registros para mostrar.';
  
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {loading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-3"></div>
      ) : (
        <div className="mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{loading ? 'Cargando...' : title}</h3>
      <p className="text-sm text-gray-500 mt-1">{loading ? 'Obteniendo datos...' : displayMessage}</p>
      
      {action && !loading && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default TableEmptyState;

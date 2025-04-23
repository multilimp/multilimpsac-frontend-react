
import React from 'react';
import { InboxIcon } from 'lucide-react';

export interface TableEmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  title = 'No hay datos',
  message = 'No se encontraron registros para mostrar.',
  icon = <InboxIcon className="h-10 w-10 text-gray-400" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{message}</p>
    </div>
  );
};

export default TableEmptyState;

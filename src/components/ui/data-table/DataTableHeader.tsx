
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, RefreshCw } from 'lucide-react';
import { DataTableHeaderProps } from './types';

export function DataTableHeader({
  table,
  searchPlaceholder = 'Buscar...',
}: DataTableHeaderProps) {
  const isFiltered = table.getState().columnFilters.length > 0 || 
                    table.getState().globalFilter !== '';

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 py-4">
      <Input
        placeholder={searchPlaceholder}
        value={table.getState().globalFilter || ''}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
      <div className="flex gap-2">
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
            }}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {table.options.meta?.onReload && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-8"
            onClick={() => table.options.meta?.onReload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refrescar
          </Button>
        )}
      </div>
    </div>
  );
}

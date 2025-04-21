
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataGridHeader } from './DataGridHeader';
import { DataGridFilter } from './DataGridFilter';
import { DataGridPagination } from './DataGridPagination';
import { useDataGridFilters } from './hooks/useDataGridFilters';
import { usePagination } from './hooks/usePagination';
import { Skeleton } from '@/components/ui/skeleton';
import { DataGridColumn, DataGridProps } from './types';
import { Card } from '../card';
import TableEmptyState from '@/components/common/TableEmptyState';

export function DataGrid<T extends object>({
  columns,
  data,
  loading = false,
  pageSize = 10,
  searchPlaceholder = 'Buscar...',
  searchKeys,
  emptyState,
  onRowClick,
  className,
  variant = 'default',
  onReload,
}: DataGridProps<T>) {
  const [tableColumns, setTableColumns] = useState<DataGridColumn[]>(columns);
  
  // Use the updated hook
  const {
    filteredData,
    filterValue,
    setFilterValue,
  } = useDataGridFilters(data, searchKeys);
  
  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(filteredData, pageSize);

  // Reset to first page when data changes
  useEffect(() => {
    goToPage(1);
  }, [data, goToPage]);

  const handleRowClick = useCallback((row: T) => {
    if (onRowClick) onRowClick(row);
  }, [onRowClick]);

  const renderCellValue = useCallback((row: T, column: DataGridColumn) => {
    if (column.render) {
      return column.render(row);
    }
    
    if (column.getValue) {
      return column.getValue(row);
    }
    
    const keys = column.key.split('.');
    let value: any = row;
    
    for (const key of keys) {
      if (value === null || value === undefined) break;
      value = value[key as keyof typeof value];
    }
    
    return value;
  }, []);

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <div className="p-4">
          <Skeleton className="h-8 w-3/12 mb-4" />
          <div className="space-y-2">
            {Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <DataGridHeader
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        searchPlaceholder={searchPlaceholder}
      />
      
      <div className="rounded-md border">
        <Table className={variant === 'compact' ? 'text-sm' : ''}>
          <TableHeader>
            <TableRow>
              {tableColumns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-32 text-center">
                  <TableEmptyState
                    title={emptyState?.title || "No hay datos"}
                    description={emptyState?.description || "No se encontraron registros."}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => handleRowClick(row)}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                >
                  {tableColumns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key}`} className={column.className}>
                      {renderCellValue(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <DataGridPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}

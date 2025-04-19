import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DataGridColumn } from "./types";
import { formatCellValue, getValueByPath } from "./utils";
import { RowActions } from "./RowActions";

interface DataGridBodyProps<T> {
  data: T[];
  columns: DataGridColumn[];
  visibleColumns: DataGridColumn[];
  loading: boolean;
  pageSize: number;
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export function DataGridBody<T extends { id: string | number }>({
  data,
  columns,
  visibleColumns,
  loading,
  pageSize,
  onRowClick,
  onEdit,
  onDelete,
}: DataGridBodyProps<T>) {
  if (loading) {
    return (
      <TableBody>
        {Array.from({ length: pageSize }).map((_, index) => (
          <TableRow key={`skeleton-${index}`}>
            {visibleColumns.filter(col => !col.hidden).map(col => (
              <TableCell key={`skeleton-${index}-${col.key}`}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }
  
  if (data.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell 
            colSpan={visibleColumns.filter(col => !col.hidden).length} 
            className="h-24 text-center"
          >
            No se encontraron resultados.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  
  return (
    <TableBody>
      {data.map((row) => (
        <TableRow 
          key={row.id} 
          className={cn(onRowClick && "cursor-pointer hover:bg-muted/60")}
          onClick={() => onRowClick && onRowClick(row)}
        >
          {visibleColumns.filter(col => !col.hidden).map(column => {
            // Si es la columna de acciones, renderizar el componente RowActions
            if (column.key === 'actions') {
              return (
                <TableCell key={`${row.id}-${column.key}`}>
                  <RowActions 
                    row={row} 
                    onEdit={onEdit} 
                    onDelete={onDelete}
                  />
                </TableCell>
              );
            }
            
            // If the column has a render function, use it
            if (column.render) {
              return (
                <TableCell key={`${row.id}-${column.key}`}>
                  {column.render(row)}
                </TableCell>
              );
            }
            
            // Otherwise, format the value based on the column type
            const value = column.getValue ? column.getValue(row) : getValueByPath(row, column.key);
            return (
              <TableCell key={`${row.id}-${column.key}`}>
                {formatCellValue(value, column.type)}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}

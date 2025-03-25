
import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DataGridColumn } from "./types";
import { formatCellValue, getValueByPath } from "./utils";

interface DataGridBodyProps<T> {
  data: T[];
  columns: DataGridColumn[];
  visibleColumns: string[];
  loading: boolean;
  pageSize: number;
  onRowClick?: (row: T) => void;
}

export function DataGridBody<T extends { id: string | number }>({
  data,
  columns,
  visibleColumns,
  loading,
  pageSize,
  onRowClick,
}: DataGridBodyProps<T>) {
  if (loading) {
    return (
      <TableBody>
        {Array.from({ length: pageSize }).map((_, index) => (
          <TableRow key={`skeleton-${index}`}>
            {visibleColumns.map(colKey => (
              <TableCell key={`skeleton-${index}-${colKey}`}>
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
            colSpan={visibleColumns.length} 
            className="h-24 text-center"
          >
            No results found.
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
          {visibleColumns.map(colKey => {
            const column = columns.find(col => col.key === colKey);
            if (!column) return null;
            
            const value = getValueByPath(row, colKey);
            return (
              <TableCell key={`${row.id}-${colKey}`}>
                {formatCellValue(value, column.type)}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}

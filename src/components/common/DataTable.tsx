
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableActions from "./TableActions";
import TableEmptyState from "./TableEmptyState";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  idField?: keyof T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  loading?: boolean;
}

function DataTable<T>({
  columns,
  data,
  idField = "id" as keyof T,
  onEdit,
  onDelete,
  onView,
  loading = false,
}: DataTableProps<T>) {
  const hasActions = !!(onEdit || onDelete || onView);
  const totalColumns = columns.length + (hasActions ? 1 : 0);

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)}>
                {column.header}
              </TableHead>
            ))}
            {hasActions && <TableHead>Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading || data.length === 0 ? (
            <TableEmptyState colSpan={totalColumns} loading={loading} />
          ) : (
            data.map((row) => (
              <TableRow key={String(row[idField])}>
                {columns.map((column) => (
                  <TableCell key={`${String(row[idField])}-${String(column.accessorKey)}`}>
                    {column.cell ? column.cell(row) : String(row[column.accessorKey] || "")}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell>
                    <TableActions 
                      row={row}
                      onView={onView}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;

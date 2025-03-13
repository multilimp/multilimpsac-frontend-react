
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

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
}

function DataTable<T>({
  columns,
  data,
  idField = "id" as keyof T,
  onEdit,
  onDelete,
  onView,
}: DataTableProps<T>) {
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
            {(onEdit || onDelete || onView) && <TableHead>Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                className="h-24 text-center"
              >
                No hay datos disponibles
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={String(row[idField])}>
                {columns.map((column) => (
                  <TableCell key={`${String(row[idField])}-${String(column.accessorKey)}`}>
                    {column.cell ? column.cell(row) : String(row[column.accessorKey] || "")}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView) && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(row)}>
                            Ver detalles
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => onDelete(row)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

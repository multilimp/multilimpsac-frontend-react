
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";

interface TableActionsProps<T = unknown> {
  row?: T;
  onView?: ((item?: T) => void) | boolean;
  onEdit?: ((item?: T) => void) | boolean;
  onDelete?: ((item?: T) => void) | boolean;
}

function TableActions<T>({
  row,
  onView,
  onEdit,
  onDelete,
}: TableActionsProps<T>): React.ReactElement {
  return (
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
          <DropdownMenuItem onClick={() => typeof onView === 'function' && onView(row)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => typeof onEdit === 'function' && onEdit(row)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => typeof onDelete === 'function' && onDelete(row)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TableActions;

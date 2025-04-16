import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

export interface RowActionsProps {
  row: any;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  editLabel?: string;
  deleteLabel?: string;
  disabled?: boolean;
}

export const RowActions: React.FC<RowActionsProps> = ({
  row,
  onEdit,
  onDelete,
  editLabel = "Editar",
  deleteLabel = "Eliminar",
  disabled = false
}) => {
  // Detener la propagación para evitar que el clic en las acciones
  // también active el evento onRowClick de la tabla
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex items-center justify-end" onClick={handleClick}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={disabled}>
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <DropdownMenuItem 
              onClick={() => onEdit(row)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              {editLabel}
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem 
              onClick={() => onDelete(row)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteLabel}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
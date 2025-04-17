
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash, Send, Ban, Check } from "lucide-react";
import { Quotation } from '@/domain/quotation/models/quotation.model';

interface QuotationActionMenuProps {
  quotation: Quotation;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Quotation['status']) => void;
}

const QuotationActionMenu: React.FC<QuotationActionMenuProps> = ({
  quotation,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Ver detalles</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          <span>Eliminar</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {quotation.status === "draft" && (
          <DropdownMenuItem onClick={() => onStatusChange("sent")}>
            <Send className="mr-2 h-4 w-4" />
            <span>Marcar como enviada</span>
          </DropdownMenuItem>
        )}
        {quotation.status === "sent" && (
          <>
            <DropdownMenuItem onClick={() => onStatusChange("approved")}>
              <Check className="mr-2 h-4 w-4" />
              <span>Aprobar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("rejected")}>
              <Ban className="mr-2 h-4 w-4" />
              <span>Rechazar</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuotationActionMenu;


import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText 
} from 'lucide-react';
import { Quotation } from '@/data/models/quotation';

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
          Ver detalles
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FileText className="mr-2 h-4 w-4" />
            Cambiar estado
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => onStatusChange('draft')}>
              <FileText className="mr-2 h-4 w-4" />
              Borrador
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('sent')}>
              <Send className="mr-2 h-4 w-4" />
              Enviada
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('approved')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprobada
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('rejected')}>
              <XCircle className="mr-2 h-4 w-4" />
              Rechazada
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('expired')}>
              <Clock className="mr-2 h-4 w-4" />
              Vencida
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuotationActionMenu;

import { DataGridColumn } from "@/components/ui/data-grid/types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

interface SalesListRow {
  codigo_venta: string;
  clientName: string;
  clientRuc: string;
  enterpriseRuc: string;
  enterpriseName: string;
  contact: Contact;
  catalogo: string;
  fecha_form: string;
  fecha_max_form: string;
  monto_venta: number;
  cod_unidad: string;
  departamento_entrega: string;
  documento_oce?: string;
  documento_ocf?: string;
}

export const getSalesColumns = (handleViewContact: (contact: Contact) => void): DataGridColumn[] => [
  { 
    key: 'codigo_venta', 
    name: 'Código Venta', 
    type: 'string', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'clientName', 
    name: 'Cliente', 
    type: 'string', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'clientRuc', 
    name: 'RUC Cliente', 
    type: 'string', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'enterpriseRuc', 
    name: 'RUC Empresa', 
    type: 'string', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'enterpriseName', 
    name: 'Razón Social Empresa', 
    type: 'string', 
    sortable: true, 
    filterable: true 
  },
  {
    key: 'contact',
    name: 'Contacto',
    type: 'string',
    sortable: false,
    filterable: false,
    getValue: (row: any) => row.contact?.name || ''
  },
  { 
    key: 'catalogo', 
    name: 'Catálogo', 
    type: 'string', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'fecha_form', 
    name: 'Fecha Formalización', 
    type: 'date', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'fecha_max_form', 
    name: 'Fecha Máx. Entrega', 
    type: 'date', 
    sortable: true, 
    filterable: true 
  },
  {
    key: 'monto_venta',
    name: 'Monto Venta',
    type: 'number',
    sortable: true,
    filterable: true,
    getValue: (row: any) => formatCurrency(row.monto_venta)
  },
  { 
    key: 'cod_unidad', 
    name: 'CUE', 
    type: 'string', 
    sortable: true, 
    filterable: true 
  },
  { 
    key: 'departamento_entrega', 
    name: 'Departamento Entrega', 
    type: 'string', 
    sortable: true, 
    filterable: true 
  }
];

export type { SalesListRow };

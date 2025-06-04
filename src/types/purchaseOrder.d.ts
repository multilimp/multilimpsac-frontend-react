export interface PurchaseOrderData {
  codigo: string;
  fecha: string;
  fechaMaxima: string;
  opImporteTotal: string;
  ocImporteTotal: string;
}

export interface PurchaseOrderCardProps {
  data?: PurchaseOrderData;
  showAccordions?: boolean;
  elevation?: number;
  sx?: any;
  loading?: boolean;
  error?: string | null;
}

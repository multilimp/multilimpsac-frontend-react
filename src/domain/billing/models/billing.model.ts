export interface Invoice {
  id: string;
  number: string;
  series: string;
  type: "factura" | "boleta" | "nota_credito" | "nota_debito";
  clientId: string;
  clientName: string;
  clientDocument: string;
  clientDocumentType: "ruc" | "dni";
  date: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "issued" | "cancelled" | "void";
  items: InvoiceItem[];
  saleId?: string;
  paymentStatus: "pending" | "partial" | "paid";
  electronicBillingStatus?: "pending" | "sent" | "accepted" | "rejected";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
  unitMeasure: string;
}

export interface InvoiceFormInput {
  type: "factura" | "boleta" | "nota_credito" | "nota_debito";
  clientId: string;
  date: string;
  dueDate: string;
  currency: string;
  items: Omit<InvoiceItem, "id" | "subtotal" | "tax" | "total">[];
  saleId?: string;
}
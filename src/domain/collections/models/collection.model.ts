export interface Collection {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "pending" | "partial" | "completed" | "overdue";
  payments: Payment[];
  balance: number;
  currency: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  collectionId: string;
  amount: number;
  date: string;
  method: "cash" | "transfer" | "check" | "credit_card";
  reference?: string;
  notes?: string;
  accountId: string;
  createdBy: string;
  createdAt: string;
}

export interface CollectionFormInput {
  invoiceId: string;
  amount: number;
  date: string;
  dueDate: string;
  currency: string;
  notes?: string;
}
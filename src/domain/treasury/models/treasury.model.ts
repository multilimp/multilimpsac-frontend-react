export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  description: string;
  status: "pending" | "completed" | "cancelled";
  paymentMethod: string;
  reference?: string;
  relatedDocumentId?: string;
  relatedDocumentType?: "sale" | "purchase" | "expense";
  accountId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: "cash" | "bank" | "credit_card";
  number?: string;
  bank?: string;
  currency: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormInput {
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: string;
  reference?: string;
  relatedDocumentId?: string;
  relatedDocumentType?: "sale" | "purchase" | "expense";
  accountId: string;
}
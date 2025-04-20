
import { EntityId, DateVO, Status, Money } from "@/core/domain/types/value-objects";

export type CollectionId = EntityId;

export type CollectionStatus = 'pending' | 'partial' | 'completed' | 'overdue';

export interface Collection {
  id: CollectionId;
  orderNumber: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  dueDate: DateVO;
  total: Money;
  status: CollectionStatus;
  pendingAmount: Money;
  collectedAmount: Money;
  invoiceId?: string;
  invoiceNumber?: string;
  balance?: number;
  currency?: string;
  notes?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionFormInput {
  invoiceId: string;
  clientId?: string;
  amount: number;
  dueDate: string;
  notes?: string;
}

export interface Payment {
  id: string;
  collectionId: string;
  amount: number;
  date: string;
  method: string;
  reference: string;
  notes?: string;
  accountId?: string;
  createdBy: string;
  createdAt: string;
}

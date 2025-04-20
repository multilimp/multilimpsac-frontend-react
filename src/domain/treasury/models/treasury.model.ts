
import { EntityId, DateVO, Status, Money } from "@/core/domain/types/value-objects";

export type TreasuryId = EntityId;

export type PaymentStatus = 'pending' | 'partial' | 'completed';

export interface Treasury {
  id: TreasuryId;
  orderNumber: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  dueDate: DateVO;
  total: Money;
  paymentStatus: PaymentStatus;
  payments: Payment[];
}

export interface Payment {
  id: string;
  date: DateVO;
  amount: Money;
  method: string;
  reference: string;
}

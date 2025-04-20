
import { EntityId, DateVO, Status, Money } from "@/core/domain/types/value-objects";

export type BillingId = EntityId;

export type BillingStatus = 'pending' | 'billed' | 'cancelled';

export interface Billing {
  id: BillingId;
  orderNumber: string;
  clientId: EntityId;
  clientName: string;
  date: DateVO;
  billingDate: DateVO;
  total: Money;
  status: BillingStatus;
  invoiceNumber?: string;
  grNumber?: string;
}

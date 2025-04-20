
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
}

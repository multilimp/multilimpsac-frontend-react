
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PurchaseOrder } from '@/features/purchaseOrder/models/purchaseOrder';

interface SalesStatusBadgeProps {
  status: PurchaseOrder['status'];
}

const SalesStatusBadge: React.FC<SalesStatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<PurchaseOrder['status'], { label: string; variant: "default" | "outline" | "secondary" | "destructive" | undefined }> = {
    pending: { label: "Pendiente", variant: "outline" },
    partial: { label: "Parcial", variant: "secondary" },
    completed: { label: "Completada", variant: "default" },
    cancelled: { label: "Cancelada", variant: "destructive" }
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default SalesStatusBadge;

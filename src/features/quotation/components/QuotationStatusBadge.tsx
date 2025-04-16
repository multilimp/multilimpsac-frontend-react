
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Quotation } from '@/data/models/quotation';

interface QuotationStatusBadgeProps {
  status: Quotation['status'];
}

const QuotationStatusBadge: React.FC<QuotationStatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<Quotation['status'], { label: string; variant: "default" | "outline" | "secondary" | "destructive" | undefined }> = {
    draft: { label: "Borrador", variant: "outline" },
    sent: { label: "Enviada", variant: "secondary" },
    approved: { label: "Aprobada", variant: "default" },
    rejected: { label: "Rechazada", variant: "destructive" },
    expired: { label: "Vencida", variant: "outline" }
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default QuotationStatusBadge;


import React from 'react';
import { Quotation } from '../models/quotation';
import QuotationStatusBadge from '../components/QuotationStatusBadge';
import QuotationActionMenu from '../components/QuotationActionMenu';
import { format } from 'date-fns';

export const formatQuotationData = (
  quotations: Quotation[],
  onView: (quotation: Quotation) => void,
  onEdit: (quotation: Quotation) => void,
  onDelete: (quotation: Quotation) => void,
  onStatusChange: (quotation: Quotation, status: Quotation['status']) => void
) => {
  return quotations.map(quotation => {
    return {
      id: quotation.id,
      number: quotation.number,
      clientName: quotation.clientName,
      date: format(new Date(quotation.date), 'dd/MM/yyyy'),
      expiryDate: format(new Date(quotation.expiryDate), 'dd/MM/yyyy'),
      total: new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(quotation.total),
      status: <QuotationStatusBadge status={quotation.status} />,
      actions: (
        <QuotationActionMenu
          quotation={quotation as any}
          onView={() => onView(quotation as any)}
          onEdit={() => onEdit(quotation as any)}
          onDelete={() => onDelete(quotation as any)}
          onStatusChange={(status) => onStatusChange(quotation as any, status)}
        />
      )
    };
  });
};

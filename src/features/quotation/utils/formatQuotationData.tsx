
import React from 'react';
import { Quotation as FeatureQuotation } from '../models/quotation';
import { Quotation as DataQuotation } from '@/data/models/quotation';
import QuotationStatusBadge from '../components/QuotationStatusBadge';
import QuotationActionMenu from '../components/QuotationActionMenu';
import { format } from 'date-fns';

// Define a type that accepts either Quotation model
type AnyQuotation = FeatureQuotation | DataQuotation;

export const formatQuotationData = (
  quotations: AnyQuotation[],
  onView: (quotation: AnyQuotation) => void,
  onEdit: (quotation: AnyQuotation) => void,
  onDelete: (quotation: AnyQuotation) => void,
  onStatusChange: (quotation: AnyQuotation, status: AnyQuotation['status']) => void
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
          quotation={quotation}
          onView={() => onView(quotation)}
          onEdit={() => onEdit(quotation)}
          onDelete={() => onDelete(quotation)}
          onStatusChange={(status) => onStatusChange(quotation, status)}
        />
      )
    };
  });
};

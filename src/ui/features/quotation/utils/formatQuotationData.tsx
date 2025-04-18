
import React from 'react';
import { Quotation } from '@/domain/quotation/models/quotation.model';
import { format } from 'date-fns';
import QuotationStatusBadge from '../components/QuotationStatusBadge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export const formatQuotationData = (
  quotations: Quotation[],
  onView: (quotation: Quotation) => void
) => {
  return quotations.map(quotation => {
    return {
      id: quotation.id,
      number: (
        <Button
          variant="link"
          className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onView(quotation);
          }}
        >
          <Eye className="h-4 w-4" />
          {quotation.number}
        </Button>
      ),
      clientName: quotation.clientName,
      date: format(new Date(quotation.date), 'dd/MM/yyyy'),
      expiryDate: format(new Date(quotation.expiryDate), 'dd/MM/yyyy'),
      total: new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(quotation.total),
      status: <QuotationStatusBadge status={quotation.status} />
    };
  });
};

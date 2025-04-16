import { format } from 'date-fns';
import { Quotation } from '@/data/models/quotation';
import QuotationStatusBadge from '../components/QuotationStatusBadge';
import QuotationActionMenu from '../components/QuotationActionMenu';

export function formatQuotationData(
  quotations: Quotation[], 
  onView: (quotation: Quotation) => void,
  onEdit: (quotation: Quotation) => void,
  onDelete: (quotation: Quotation) => void,
  onStatusChange: (quotation: Quotation, status: Quotation['status']) => void
) {
  return quotations.map(quotation => {
    // Create a copy of the quotation with formatted fields but keeping the original object structure
    return {
      ...quotation,
      formattedDate: format(new Date(quotation.date), 'dd/MM/yyyy'),
      formattedExpiryDate: format(new Date(quotation.expiryDate), 'dd/MM/yyyy'),
      formattedTotal: `S/ ${quotation.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      statusBadge: <QuotationStatusBadge status={quotation.status} />,
      actions: <QuotationActionMenu 
                quotation={quotation} 
                onView={() => onView(quotation)}
                onEdit={() => onEdit(quotation)}
                onDelete={() => onDelete(quotation)}
                onStatusChange={(status) => onStatusChange(quotation, status)}
              />
    };
  });
}

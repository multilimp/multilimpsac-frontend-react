
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Quotation } from '@/domain/quotation/models/quotation.model';
import { quotationService } from '@/domain/quotation/services/quotation.service';

interface UseQuotationsOptions {
  defaultPageSize?: number;
  defaultStatus?: Quotation['status'];
}

interface QuotationFilter {
  status?: Quotation['status'];
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
}

export function useQuotations(options: UseQuotationsOptions = {}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.defaultPageSize || 10);
  const [filters, setFilters] = useState<QuotationFilter>({
    status: options.defaultStatus
  });

  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['quotations', currentPage, pageSize, filters],
    queryFn: async () => {
      return quotationService.getQuotations({
        page: currentPage,
        pageSize,
        ...filters
      });
    }
  });

  const updateFilter = (filterUpdate: Partial<QuotationFilter>) => {
    setFilters(prev => ({ ...prev, ...filterUpdate }));
    // Reset to first page when filter changes
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return {
    quotations: data?.data || [],
    totalCount: data?.count || 0,
    totalPages: Math.ceil((data?.count || 0) / pageSize),
    currentPage,
    pageSize,
    filters,
    isLoading,
    error,
    setCurrentPage,
    setPageSize,
    updateFilter,
    clearFilters,
    refetch
  };
}

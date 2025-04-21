
import { ReactNode } from 'react';

export interface DataGridColumn {
  key: string;
  name: string;
  type: ColumnType;
  sortable: boolean;
  filterable: boolean;
  getValue?: (row: any) => string | number;
  render?: (row: any) => ReactNode;
  width?: number;
  hidden?: boolean;
  className?: string;
}

export type ColumnType = 'string' | 'number' | 'date' | 'boolean';

export interface DataGridProps<T = any> {
  data: T[];
  columns: DataGridColumn[];
  loading?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onReload?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
  searchPlaceholder?: string;
  searchKeys?: string[];
  emptyState?: {
    title?: string;
    description?: string;
  };
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface FilterConfig {
  value: string;
  onChange: (value: string) => void;
}

export interface DataGridHeaderProps {
  filterValue: string;
  setFilterValue: (value: string) => void;
  searchPlaceholder: string;
}

export interface DataGridPaginationProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
}

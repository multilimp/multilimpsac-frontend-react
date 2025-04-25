
import { ReactNode } from 'react';

export interface DataTableColumn<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: ({ row }: { row: { original: T } }) => ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  meta?: Record<string, any>;
}

export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  onReload?: () => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
}

export interface DataTableFilterProps {
  column: any;
  table: any;
}

export interface DataTablePaginationProps {
  table: any;
}

export interface DataTableHeaderProps {
  table: any;
  searchPlaceholder?: string;
}

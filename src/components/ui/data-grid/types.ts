
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
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
  key?: string; // Adding key for backward compatibility
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: DataGridColumn[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onSort?: (config: SortConfig) => void;
  onFilter?: (filters: Record<string, any>) => void;
  defaultSort?: SortConfig;
  pageSize?: number;
  onFilterChange?: (filters: Record<string, any>) => void;
  onColumnToggle?: (columns: DataGridColumn[]) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onDownload?: () => void;
  onReload?: () => void;
}

export type ColumnType = 'string' | 'number' | 'date' | 'boolean';

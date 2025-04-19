
import { ReactNode } from 'react';

export interface DataGridColumn {
  key: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
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
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: DataGridColumn[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onSort?: (config: SortConfig) => void;
  onFilter?: (filters: Record<string, any>) => void;
  defaultSort?: SortConfig;
}

export type ColumnType = 'string' | 'number' | 'date' | 'boolean';

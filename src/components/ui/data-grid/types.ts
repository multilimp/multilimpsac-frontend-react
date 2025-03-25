
export type ColumnType = 'string' | 'number' | 'date' | 'boolean';

// Column definition interface
export interface DataGridColumn {
  key: string;
  name: string;
  type: ColumnType;
  sortable?: boolean;
  filterable?: boolean;
}

// Main DataGrid props interface
export interface DataGridProps<T> {
  data: T[];
  columns: DataGridColumn[];
  loading?: boolean;
  pageSize?: number;
  onFilterChange?: (filters: Record<string, any>) => void;
  onColumnToggle?: (columns: string[]) => void;
  onRowClick?: (row: T) => void;
  onDownload?: () => void;
  onReload?: () => void;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataGridContextProps {
  columns: DataGridColumn[];
  visibleColumns: string[];
  sortConfig: SortConfig | null;
  filters: Record<string, any>;
  loading: boolean;
  handleSort: (key: string) => void;
  handleFilterChange: (columnKey: string, value: any) => void;
  handleColumnToggle: (column: string) => void;
}

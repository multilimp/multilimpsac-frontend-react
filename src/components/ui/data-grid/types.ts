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
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
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

export interface DataGridTableHeadProps {
  columns: DataGridColumn[];
  visibleColumns: string[];
  filters: Record<string, any>;
  sortConfig: SortConfig | null; 
  onSort: (key: string) => void;
  onFilterChange: (columnKey: string, value: any) => void;
  showFilters?: boolean;
}

export interface DataGridHeaderProps {
  columns: DataGridColumn[];
  visibleColumns: string[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onColumnToggle: (column: string) => void;
  onDownload: () => void;
  onReload: () => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

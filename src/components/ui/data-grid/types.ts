
export interface DataGridColumn {
  key: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  sortable: boolean;
  filterable: boolean;
  getValue?: (row: any) => string | number;
  render?: (row: any) => React.ReactNode;
  width?: number;
  hidden?: boolean;
}

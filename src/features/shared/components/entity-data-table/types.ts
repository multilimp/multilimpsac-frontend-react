
import { DataGridColumn } from '@/components/ui/data-grid';
import React from 'react';

export interface EntityDataTableProps<T extends { id: string }> {
  title: string;
  description?: string;
  data: T[];
  isLoading: boolean;
  columns: DataGridColumn[];
  onRowClick?: (row: T) => void;
  onReload?: () => void;
  onDelete?: (id: string) => Promise<void>;
  renderDetailPanel?: (row: T) => React.ReactNode;
  renderFormContent?: (data: Partial<T>, onChange: (field: string, value: any) => void) => React.ReactNode;
  onSave?: (data: Partial<T>) => Promise<void>;
  addButtonText?: string;
  domain: string;
  permissionScope: string;
}

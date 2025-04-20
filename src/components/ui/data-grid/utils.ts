
import { ColumnType, DataGridColumn } from './types';
import { formatDate } from '@/lib/utils';

export function getValueByPath(obj: any, path: string) {
  return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

export function formatCellValue(value: any, type: ColumnType): string {
  if (value === null || value === undefined) return '';
  
  switch (type) {
    case 'date':
      return typeof value === 'string' ? formatDate(value) : String(value);
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value);
    default:
      return String(value);
  }
}

export function generateCSV(
  data: any[], 
  columns: DataGridColumn[],
  columnDefinitions: DataGridColumn[]
): string {
  const visibleData = data.map(row => {
    const rowData: Record<string, any> = {};
    columns.forEach(col => {
      const column = columnDefinitions.find(c => c.key === col.key);
      if (column) {
        let value;
        if (column.getValue) {
          value = column.getValue(row);
        } else {
          value = getValueByPath(row, column.key);
        }
        rowData[column.name] = formatCellValue(value, column.type);
      }
    });
    return rowData;
  });
  
  const csvContent = [
    columns.map(col => col.name).join(','),
    ...visibleData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"`
          : value
      ).join(',')
    )
  ].join('\n');
  
  return csvContent;
}

export function downloadCSV(content: string, filename = `data-export-${new Date().toISOString()}.csv`) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const getCSVData = (data: any[], columns: DataGridColumn[]): string[][] => {
  const headers = columns.map((col) => col.name);
  const rows = data.map((item) => {
    return columns.map((col) => {
      let value;
      if (col.getValue) {
        value = col.getValue(item);
      } else {
        value = getValueByPath(item, col.key);
      }
      return typeof value === 'string' ? value : JSON.stringify(value);
    });
  });
  return [headers, ...rows];
};

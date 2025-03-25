
import { ColumnType } from './types';
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
  columns: string[], 
  columnDefinitions: { key: string; name: string; type: ColumnType }[]
): string {
  const visibleData = data.map(row => {
    const rowData: Record<string, any> = {};
    columns.forEach(colKey => {
      const column = columnDefinitions.find(col => col.key === colKey);
      if (column) {
        const value = getValueByPath(row, colKey);
        rowData[column.name] = formatCellValue(value, column.type);
      }
    });
    return rowData;
  });
  
  const csvContent = [
    columns.map(colKey => {
      const column = columnDefinitions.find(col => col.key === colKey);
      return column ? column.name : colKey;
    }).join(','),
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


import { useState, useMemo } from "react";
import { getValueByPath } from "../utils";
import { DataGridColumn, SortConfig } from "../types";

export function useDataGridFilters<T extends { id: string | number }>(
  data: T[],
  columns: DataGridColumn[],
  visibleColumns: string[],
  searchTerm: string,
  sortConfig: SortConfig | null
) {
  // State for filters
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  // Handle filter changes
  const handleFilterChange = (columnKey: string, value: any) => {
    const newFilters = { ...filters, [columnKey]: value };
    
    if (!value) {
      delete newFilters[columnKey];
    }
    
    setFilters(newFilters);
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      
      const column = columns.find(col => col.key === key);
      if (!column) return;
      
      result = result.filter(row => {
        const cellValue = getValueByPath(row, key);
        
        if (column.type === 'number' && typeof value === 'object') {
          const numValue = value as { min?: number; max?: number };
          if (numValue.min !== undefined && numValue.max !== undefined) {
            return cellValue >= numValue.min && cellValue <= numValue.max;
          }
          if (numValue.min !== undefined) {
            return cellValue >= numValue.min;
          }
          if (numValue.max !== undefined) {
            return cellValue <= numValue.max;
          }
          return true;
        }
        
        if (typeof value === 'string' && value) {
          const stringCellValue = String(cellValue || '');
          return stringCellValue.toLowerCase().includes(value.toLowerCase());
        }
        
        return true;
      });
    });
    
    // Apply global search
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(row => {
        return visibleColumns.some(key => {
          const cellValue = getValueByPath(row, key);
          return cellValue !== null && 
                 String(cellValue || '').toLowerCase().includes(normalizedSearchTerm);
        });
      });
    }
    
    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = getValueByPath(a, sortConfig.key);
        const bValue = getValueByPath(b, sortConfig.key);
        
        if (aValue === bValue) return 0;
        
        const compareResult = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? compareResult : -compareResult;
      });
    }
    
    return result;
  }, [data, filters, searchTerm, sortConfig, visibleColumns, columns]);

  return {
    filters,
    filteredData,
    handleFilterChange
  };
}


import React, { useState, useEffect, useMemo } from "react";
import { Table } from "@/components/ui/table";
import { DataGridPagination } from "./DataGridPagination";
import { DataGridTableHead } from "./DataGridTableHead";
import { DataGridHeader } from "./DataGridHeader";
import { DataGridBody } from "./DataGridBody";
import { generateCSV, downloadCSV } from "./utils";
import { ColumnType, DataGridColumn, DataGridProps } from "./types";

export type { ColumnType, DataGridColumn, DataGridProps };

export function DataGrid<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  pageSize = 10,
  onFilterChange,
  onColumnToggle,
  onRowClick,
  onDownload,
  onReload,
}: DataGridProps<T>) {
  // State for visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.key)
  );
  
  // State for filters
  const [filters, setFilters] = useState<Record<string, T>>({});
  
  // State for global search
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Handle column visibility toggle
  const handleColumnToggle = (column: string) => {
    const updatedColumns = visibleColumns.includes(column)
      ? visibleColumns.filter(col => col !== column)
      : [...visibleColumns, column];
    
    setVisibleColumns(updatedColumns);
    
    if (onColumnToggle) {
      onColumnToggle(updatedColumns);
    }
  };
  
  // Handle column sort
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Handle filter changes
  const handleFilterChange = (columnKey: string, value: any) => {
    const newFilters = { ...filters, [columnKey]: value };
    
    if (!value) {
      delete newFilters[columnKey];
    }
    
    setFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  // Handle global search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle CSV download
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    
    // Default download implementation
    const csvContent = generateCSV(filteredData, visibleColumns, columns);
    downloadCSV(csvContent);
  };
  
  // Handle table reload
  const handleReload = () => {
    if (onReload) {
      onReload();
    }
    setSearchTerm("");
    setFilters({});
    setSortConfig(null);
    setCurrentPage(1);
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
          const { min, max } = value;
          if (min !== undefined && max !== undefined) {
            return cellValue >= min && cellValue <= max;
          }
          if (min !== undefined) {
            return cellValue >= min;
          }
          if (max !== undefined) {
            return cellValue <= max;
          }
          return true;
        }
        
        if (typeof value === 'string' && value) {
          return String(cellValue).toLowerCase().includes(value.toLowerCase());
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
                 String(cellValue).toLowerCase().includes(normalizedSearchTerm);
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
  
  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);
  
  // Total pages
  const totalPages = Math.ceil(filteredData.length / pageSize);
  
  // Import getValueByPath function from utils
  function getValueByPath(obj: T, path: string) {
    return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
  }

  return (
    <div className="space-y-4">
      <DataGridHeader
        columns={columns}
        visibleColumns={visibleColumns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onColumnToggle={handleColumnToggle}
        onDownload={handleDownload}
        onReload={handleReload}
      />
      
      <div className="rounded-md border">
        <Table>
          <DataGridTableHead
            columns={columns}
            visibleColumns={visibleColumns}
            filters={filters}
            sortConfig={sortConfig}
            onSort={handleSort}
            onFilterChange={handleFilterChange}
          />
          <DataGridBody
            data={paginatedData}
            columns={columns}
            visibleColumns={visibleColumns}
            loading={loading}
            pageSize={pageSize}
            onRowClick={onRowClick}
          />
        </Table>
      </div>
      
      <div className="flex items-center justify-end">
        <DataGridPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default DataGrid;

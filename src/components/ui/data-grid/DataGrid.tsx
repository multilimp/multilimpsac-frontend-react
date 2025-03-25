
import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, FileDown, Loader, Columns3 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataGridFilter } from "./DataGridFilter";
import { DataGridPagination } from "./DataGridPagination";
import { cn, formatDate } from "@/lib/utils";

// Define the column types
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

function getValueByPath(obj: any, path: string) {
  return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

function formatCellValue(value: any, type: ColumnType): string {
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
  const [filters, setFilters] = useState<Record<string, any>>({});
  
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
    const visibleData = filteredData.map(row => {
      const rowData: Record<string, any> = {};
      visibleColumns.forEach(colKey => {
        const column = columns.find(col => col.key === colKey);
        if (column) {
          const value = getValueByPath(row, colKey);
          rowData[column.name] = formatCellValue(value, column.type);
        }
      });
      return rowData;
    });
    
    const csvContent = [
      visibleColumns.map(colKey => {
        const column = columns.find(col => col.key === colKey);
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
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `data-export-${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  
  // Render table head
  const renderTableHead = () => {
    return (
      <TableHeader>
        <TableRow>
          {columns
            .filter(column => visibleColumns.includes(column.key))
            .map(column => (
              <TableHead 
                key={column.key}
                className={cn(
                  "whitespace-nowrap font-medium text-muted-foreground",
                  column.sortable && "cursor-pointer select-none"
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-1">
                  {column.name}
                  {sortConfig && sortConfig.key === column.key && (
                    sortConfig.direction === 'asc' 
                      ? <ChevronUp className="h-4 w-4" /> 
                      : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
            ))}
        </TableRow>
        <TableRow>
          {columns
            .filter(column => visibleColumns.includes(column.key))
            .map(column => (
              <TableHead key={`filter-${column.key}`} className="p-0">
                {column.filterable && (
                  <div className="p-2">
                    <DataGridFilter 
                      column={column}
                      value={filters[column.key]}
                      onChange={(value) => handleFilterChange(column.key, value)}
                    />
                  </div>
                )}
              </TableHead>
            ))}
        </TableRow>
      </TableHeader>
    );
  };
  
  // Render table body
  const renderTableBody = () => {
    if (loading) {
      return (
        <TableBody>
          {Array.from({ length: pageSize }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              {visibleColumns.map(colKey => (
                <TableCell key={`skeleton-${index}-${colKey}`}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      );
    }
    
    if (paginatedData.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell 
              colSpan={visibleColumns.length} 
              className="h-24 text-center"
            >
              No results found.
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    
    return (
      <TableBody>
        {paginatedData.map((row) => (
          <TableRow 
            key={row.id} 
            className={cn(onRowClick && "cursor-pointer hover:bg-muted/60")}
            onClick={() => onRowClick && onRowClick(row)}
          >
            {visibleColumns.map(colKey => {
              const column = columns.find(col => col.key === colKey);
              if (!column) return null;
              
              const value = getValueByPath(row, colKey);
              return (
                <TableCell key={`${row.id}-${colKey}`}>
                  {formatCellValue(value, column.type)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Input 
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="pr-8"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={visibleColumns.includes(column.key)}
                  onCheckedChange={() => handleColumnToggle(column.key)}
                >
                  {column.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReload}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Loading
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 21h5v-5"></path>
                </svg>
                Reload
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          {renderTableHead()}
          {renderTableBody()}
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

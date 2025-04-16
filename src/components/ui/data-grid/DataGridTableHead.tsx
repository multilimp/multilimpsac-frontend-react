
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataGridFilter } from "./DataGridFilter";
import { cn } from "@/lib/utils";
import { DataGridColumn, SortConfig } from "./types";

interface DataGridTableHeadProps {
  columns: DataGridColumn[];
  visibleColumns: string[];
  filters: Record<string, any>;
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  onFilterChange: (columnKey: string, value: any) => void;
  showFilters?: boolean;
}

export const DataGridTableHead: React.FC<DataGridTableHeadProps> = ({
  columns,
  visibleColumns,
  filters,
  sortConfig,
  onSort,
  onFilterChange,
  showFilters = true,
}) => {
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
              onClick={() => column.sortable && onSort(column.key)}
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
      {showFilters && (
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
                      onChange={(value) => onFilterChange(column.key, value)}
                    />
                  </div>
                )}
              </TableHead>
            ))}
        </TableRow>
      )}
    </TableHeader>
  );
};


import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { DataGridFilter } from "./DataGridFilter";
import { DataGridColumn, SortConfig } from "./types";

interface DataGridTableHeadProps {
  columns: DataGridColumn[];
  visibleColumns: DataGridColumn[];
  filters: Record<string, any>;
  sortConfig: SortConfig;
  showFilters: boolean;
  onSort: (key: string) => void;
  onFilterChange: (key: string, value: any) => void;
}

export function DataGridTableHead({
  columns,
  visibleColumns,
  filters,
  sortConfig,
  showFilters,
  onSort,
  onFilterChange,
}: DataGridTableHeadProps) {
  // Determine sort icon to display
  const getSortIcon = (columnKey: string) => {
    if (sortConfig.column !== columnKey) {
      return <ChevronsUpDown className="h-3 w-3 ml-1" />;
    }

    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-3 w-3 ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1" />
    );
  };

  return (
    <TableHeader>
      <TableRow>
        {visibleColumns.map((column) => (
          <TableHead key={column.key} className="px-4 py-2 min-w-20">
            <div className="space-y-2">
              <button
                onClick={() => column.sortable && onSort(column.key)}
                className={`flex items-center ${
                  column.sortable ? "cursor-pointer hover:text-primary" : ""
                } ${sortConfig.column === column.key ? "text-primary" : ""}`}
                type="button"
              >
                {column.name}
                {column.sortable && getSortIcon(column.key)}
              </button>

              {/* Filters */}
              {showFilters && column.filterable && (
                <DataGridFilter
                  column={column}
                  value={filters[column.key] || ""}
                  onChange={(value) => onFilterChange(column.key, value)}
                />
              )}
            </div>
          </TableHead>
        ))}
        {/* Actions column if needed */}
        <TableHead className="px-4 py-2 w-24">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
}

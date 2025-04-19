
import React, { useState, useEffect, useMemo } from "react";
import { Table } from "@/components/ui/table";
import { DataGridPagination } from "./DataGridPagination";
import { DataGridTableHead } from "./DataGridTableHead";
import { DataGridHeader } from "./DataGridHeader";
import { DataGridBody } from "./DataGridBody";
import { useDataGridState } from "./hooks/useDataGridState";
import { useDataGridFilters } from "./hooks/useDataGridFilters";
import { usePagination } from "./hooks/usePagination";
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
  onEdit,
  onDelete,
  onDownload,
  onReload,
}: DataGridProps<T>) {
  // Use our extracted hooks for state management
  const {
    visibleColumns,
    visibleColumnsKeys,
    sortConfig,
    searchTerm,
    showFilters,
    handleColumnToggle,
    handleSort,
    handleSearch,
    handleToggleFilters,
    setVisibleColumns
  } = useDataGridState(columns);
  
  // Filters hook
  const {
    filters,
    filteredData,
    handleFilterChange
  } = useDataGridFilters(data, columns, visibleColumnsKeys, searchTerm, sortConfig);
  
  // Pagination hook
  const {
    currentPage,
    paginatedData,
    totalPages,
    setCurrentPage
  } = usePagination(filteredData, pageSize);
  
  // Custom handlers that call the props
  const handleExternalFilterChange = (filters: Record<string, any>) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };
  
  const handleExternalColumnToggle = (columns: DataGridColumn[]) => {
    if (onColumnToggle) {
      onColumnToggle(columns);
    }
  };
  
  // Handle download
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    
    // Default download implementation is now in utils.ts
    import("./utils").then(({ generateCSV, downloadCSV }) => {
      const csvContent = generateCSV(filteredData, visibleColumnsKeys, columns);
      downloadCSV(csvContent);
    });
  };
  
  // Handle reload
  const handleReload = () => {
    if (onReload) {
      onReload();
    }
    setCurrentPage(1);
  };
  
  // Call external callbacks when internal state changes
  useEffect(() => {
    handleExternalFilterChange(filters);
  }, [filters]);
  
  useEffect(() => {
    handleExternalColumnToggle(visibleColumns);
  }, [visibleColumns]);

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
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
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
            showFilters={showFilters}
          />
          <DataGridBody
            data={paginatedData}
            columns={columns}
            visibleColumns={visibleColumns}
            loading={loading}
            pageSize={pageSize}
            onRowClick={onRowClick}
            onEdit={onEdit}
            onDelete={onDelete}
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

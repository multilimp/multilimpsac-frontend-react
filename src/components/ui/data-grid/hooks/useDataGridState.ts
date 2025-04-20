import { useState, useCallback } from "react";
import { DataGridColumn, SortConfig } from "../types";

export const useDataGridState = (columns: DataGridColumn[]) => {
  const [visibleColumns, setVisibleColumns] = useState<DataGridColumn[]>(columns);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: "",
    direction: "asc"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Toggle column visibility
  const handleColumnToggle = useCallback((columnKey: string, isVisible: boolean) => {
    if (isVisible) {
      const columnToAdd = columns.find((col) => col.key === columnKey);
      if (columnToAdd) {
        setVisibleColumns((prev) => [...prev, columnToAdd]);
      }
    } else {
      setVisibleColumns((prev) => prev.filter((col) => col.key !== columnKey));
    }
  }, [columns]);

  // Get visible column keys
  const visibleColumnsKeys = visibleColumns.map(col => col.key);

  // Handle sorting
  const handleSort = useCallback((column: string) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return {
          column,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      return {
        column,
        direction: "asc"
      };
    });
  }, []);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Toggle filters
  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return {
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
  };
};

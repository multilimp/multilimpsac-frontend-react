
import { useState } from "react";
import { DataGridColumn, SortConfig } from "../types";

export function useDataGridState(columns: DataGridColumn[]) {
  // State for visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.key)
  );
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  
  // State for global search
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for showing/hiding filters
  const [showFilters, setShowFilters] = useState(true);

  // Handle column visibility toggle
  const handleColumnToggle = (column: string) => {
    const updatedColumns = visibleColumns.includes(column)
      ? visibleColumns.filter(col => col !== column)
      : [...visibleColumns, column];
    
    setVisibleColumns(updatedColumns);
  };
  
  // Handle column sort
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Handle global search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Toggle filters visibility
  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return {
    visibleColumns,
    sortConfig,
    searchTerm,
    showFilters,
    handleColumnToggle,
    handleSort,
    handleSearch,
    handleToggleFilters
  };
}


import { useState } from "react";
import { DataGridColumn, SortConfig } from "../types";

export function useDataGridState(columns: DataGridColumn[]) {
  // State for visible columns
  const [visibleColumns, setVisibleColumns] = useState<DataGridColumn[]>(columns);
  
  // State for sorting
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  
  // State for global search
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for showing/hiding filters
  const [showFilters, setShowFilters] = useState(false);

  // Handle column visibility toggle
  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns(current => 
      current.map(col => 
        col.key === columnKey 
          ? { ...col, hidden: !col.hidden }
          : col
      )
    );
  };
  
  // Handle column sort
  const handleSort = (column: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.column === column) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ column, direction, key: column });
  };
  
  // Handle global search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Toggle filters visibility
  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Get only the keys of visible columns
  const getVisibleColumnsKeys = (): string[] => {
    return visibleColumns
      .filter(col => !col.hidden)
      .map(col => col.key);
  };

  return {
    visibleColumns,
    visibleColumnsKeys: getVisibleColumnsKeys(),
    sortConfig,
    searchTerm,
    showFilters,
    handleColumnToggle,
    handleSort,
    handleSearch,
    handleToggleFilters,
    setVisibleColumns
  };
}

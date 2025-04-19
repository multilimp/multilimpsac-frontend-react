
import { useState, useEffect, useMemo } from "react";
import { DataGridColumn, SortConfig } from "../types";

export const useDataGridFilters = <T extends Record<string, any>>(
  data: T[],
  columns: DataGridColumn[],
  visibleColumnsKeys: string[],
  searchTerm: string,
  sortConfig: SortConfig
) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  // Filter data based on search term and column filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search term filter across all searchable columns
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((row) => {
        return columns.some((col) => {
          if (!col.filterable) return false;
          
          // Get the value either through a getValue function or directly
          let value = col.getValue
            ? col.getValue(row)
            : String(row[col.key] || "");
            
          if (value === undefined || value === null) return false;
          
          // Convert to string for comparison
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    // Apply column-specific filters
    Object.entries(filters).forEach(([key, filterValue]) => {
      if (!filterValue) return;
      
      const column = columns.find((col) => col.key === key);
      if (!column || !column.filterable) return;
      
      result = result.filter((row) => {
        // Get the value either through a getValue function or directly
        const value = column.getValue
          ? column.getValue(row)
          : row[column.key];
          
        if (value === undefined || value === null) return false;
        
        // Handle different types of filters
        switch (column.type) {
          case "number":
            return String(value) === String(filterValue);
            
          case "date": {
            const dateValue = new Date(value);
            const filterDate = new Date(filterValue);
            return dateValue.toDateString() === filterDate.toDateString();
          }
          
          case "boolean":
            return value === (filterValue === "true");
            
          default: // string
            return String(value)
              .toLowerCase()
              .includes(String(filterValue).toLowerCase());
        }
      });
    });

    // Apply sorting
    if (sortConfig.column) {
      const column = columns.find((col) => col.key === sortConfig.column);
      
      if (column) {
        result.sort((a, b) => {
          // Get values using getValue if provided, otherwise access directly
          const valueA = column.getValue
            ? column.getValue(a)
            : a[sortConfig.column];
          const valueB = column.getValue
            ? column.getValue(b)
            : b[sortConfig.column];
          
          // Handle different types of values
          if (column.type === "number") {
            return sortConfig.direction === "asc"
              ? Number(valueA) - Number(valueB)
              : Number(valueB) - Number(valueA);
          } else if (column.type === "date") {
            const dateA = new Date(valueA);
            const dateB = new Date(valueB);
            return sortConfig.direction === "asc"
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          } else {
            // String comparison
            const strA = String(valueA || "").toLowerCase();
            const strB = String(valueB || "").toLowerCase();
            
            if (sortConfig.direction === "asc") {
              return strA.localeCompare(strB);
            } else {
              return strB.localeCompare(strA);
            }
          }
        });
      }
    }

    return result;
  }, [data, columns, searchTerm, filters, sortConfig, visibleColumnsKeys]);

  // Handle filter change for a specific column
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    filters,
    filteredData,
    handleFilterChange,
  };
};


import { useState, useCallback, useMemo } from "react";

export interface UseDataGridFiltersResult<T> {
  filteredData: T[];
  filterValue: string;
  setFilterValue: (value: string) => void;
  filters: Record<string, any>;
  handleFilterChange: (key: string, value: any) => void;
}

export function useDataGridFilters<T>(data: T[], searchKeys?: string[]): UseDataGridFiltersResult<T> {
  const [filterValue, setFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const filteredData = useMemo(() => {
    // If no filter value, just apply column filters
    if (!filterValue && Object.keys(filters).length === 0) return data;

    return data.filter((row) => {
      // Filter by search value
      if (filterValue && searchKeys) {
        const normalizedFilter = filterValue.toLowerCase();
        const matchesSearch = searchKeys.some((key) => {
          const value = getNestedValue(row, key);
          return value && String(value).toLowerCase().includes(normalizedFilter);
        });

        if (!matchesSearch) return false;
      }

      // Filter by column filters
      for (const [key, filterValue] of Object.entries(filters)) {
        if (filterValue === undefined || filterValue === null || filterValue === "") continue;

        const value = getNestedValue(row, key);

        if (typeof filterValue === "object" && "min" in filterValue) {
          // Number range filter
          const { min, max } = filterValue as { min?: number; max?: number };
          if (min !== undefined && value < min) return false;
          if (max !== undefined && value > max) return false;
        } else if (typeof filterValue === "string") {
          // String filter
          if (!String(value).toLowerCase().includes(filterValue.toLowerCase())) return false;
        } else {
          // Exact match
          if (value !== filterValue) return false;
        }
      }

      return true;
    });
  }, [data, filterValue, filters, searchKeys]);

  return {
    filteredData,
    filterValue,
    setFilterValue,
    filters,
    handleFilterChange,
  };
}

// Helper function to get nested property values
function getNestedValue(obj: any, path: string): any {
  const keys = path.split(".");
  return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}

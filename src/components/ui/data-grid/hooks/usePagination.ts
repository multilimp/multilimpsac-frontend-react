
import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(data: T[], pageSize: number) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);
  
  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);
  
  // Total pages
  const totalPages = Math.ceil(data.length / pageSize);
  
  return {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages
  };
}


import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

interface TableEmptyStateProps {
  colSpan: number;
  loading?: boolean;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({ colSpan, loading }) => {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center"
      >
        {loading ? "Cargando datos..." : "No hay datos disponibles"}
      </TableCell>
    </TableRow>
  );
};

export default TableEmptyState;

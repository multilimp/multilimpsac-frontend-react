
import React from "react";
import { format } from "date-fns";
import { Column } from "@/components/common/DataTable";
import { Quotation } from "@/data/models/quotation";
import QuotationStatusBadge from "./QuotationStatusBadge";

export const getQuotationColumns = (): Column<Quotation>[] => [
  {
    header: "Número",
    accessorKey: "number",
  },
  {
    header: "Cliente",
    accessorKey: "clientName",
  },
  {
    header: "Fecha",
    accessorKey: "date",
    cell: (quotation) => format(new Date(quotation.date), "dd/MM/yyyy"),
  },
  {
    header: "Expira",
    accessorKey: "expiryDate",
    cell: (quotation) => format(new Date(quotation.expiryDate), "dd/MM/yyyy"),
  },
  {
    header: "Total",
    accessorKey: "total",
    cell: (quotation) => `$${quotation.total.toFixed(2)}`,
  },
  {
    header: "Estado",
    accessorKey: "status",
    cell: (quotation) => <QuotationStatusBadge status={quotation.status} />,
  },
];

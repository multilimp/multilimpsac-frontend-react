
import React, { useEffect, useState, useMemo } from "react";
import { fetchAllQuotationCatalog, QuotationCatalogRow } from "../services/quotationCatalogService";
import { DataGrid, DataGridColumn } from "@/components/ui/data-grid";
import { Button } from "@/components/ui/button";
import { Download, Columns2 } from "lucide-react";

function toCsv(rows: QuotationCatalogRow[], columns: DataGridColumn[]) {
  const sep = ",";
  const head = columns.filter(c => !c.hidden).map(col => `"${col.name}"`).join(sep);
  const body = rows.map(row =>
    columns
      .filter(c => !c.hidden)
      .map(col => {
        // @ts-ignore
        let val = row[col.key];
        if (val == null) return "";
        // Dates to YYYY-MM-DD
        if (col.type === "date") return `"${val?.toString().substring(0, 10) || ""}"`;
        // Numbers
        if (col.type === "number") return String(val);
        return `"${val}"`;
      })
      .join(sep)
  );
  return head + "\n" + body.join("\n");
}

const ALL_COLUMNS: DataGridColumn[] = [
  { key: "codigoCotizacion", name: "Código Cotización", type: "string", sortable: true, filterable: true },
  { key: "rucCliente", name: "RUC Cliente", type: "string", sortable: true, filterable: true },
  { key: "region", name: "Región", type: "string", sortable: true, filterable: true },
  { key: "montoTotal", name: "Monto Total", type: "number", sortable: true, filterable: true,
    getValue: (row: QuotationCatalogRow) => row.montoTotal },
  { key: "fechaEntrega", name: "Plazo Entrega", type: "date", sortable: true, filterable: true },
  { key: "fechaCotizacion", name: "Fecha Cotización", type: "date", sortable: true, filterable: true },
  {
    key: "estado",
    name: "Estado",
    type: "string",
    sortable: true,
    filterable: true,
    render: (row: QuotationCatalogRow) => {
      const stateColors: Record<string, string> = {
        cotizado: "bg-gray-100 text-gray-900",
        aprobado: "bg-green-100 text-green-800",
        rechazado: "bg-red-100 text-red-800"
      };
      return <span className={`px-2 py-1 rounded text-xs font-semibold ${stateColors[row.estado] || ""}`}>{row.estado}</span>;
    }
  }
];

export default function QuotationCatalogTable() {
  const [data, setData] = useState<QuotationCatalogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<DataGridColumn[]>(ALL_COLUMNS);
  const [columnToggles, setColumnToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(ALL_COLUMNS.map((col) => [col.key, true]))
  );

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchAllQuotationCatalog()
      .then(rows => {
        if (mounted) setData(rows);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Column toggle logic
  const visibleColumns = useMemo(
    () => columns.map(col => ({ ...col, hidden: !columnToggles[col.key] })),
    [columns, columnToggles]
  );

  const handleToggle = (key: string) => {
    setColumnToggles((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // CSV
  const handleExportCSV = () => {
    const csv = toCsv(data, visibleColumns);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cotizaciones.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1" />
            Exportar CSV
          </Button>
          <div className="flex items-center gap-1">
            <Columns2 className="w-5 h-5 text-muted-foreground" />
            {/* Toggle columns */}
            {ALL_COLUMNS.map(col => (
              <label key={col.key} className="flex items-center ml-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={columnToggles[col.key]}
                  onChange={() => handleToggle(col.key)}
                  className="mr-1 accent-primary"
                />
                {col.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      <DataGrid
        data={data}
        columns={visibleColumns}
        loading={loading}
        pageSize={15}
        variant="default"
        searchPlaceholder="Busca cotizaciones, RUC, región, estado..."
        searchKeys={ALL_COLUMNS.map(c => c.key)}
        emptyState={{ title: "No hay cotizaciones", description: "No se encontraron cotizaciones registradas." }}
      />
    </div>
  );
}

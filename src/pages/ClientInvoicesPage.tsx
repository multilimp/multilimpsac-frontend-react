
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Plus } from 'lucide-react';

type InvoiceStatus = 'paid' | 'pending' | 'overdue';

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  total: number;
  status: InvoiceStatus;
}

const StatusBadge = ({ status }: { status: InvoiceStatus }) => {
  const statusStyles = {
    paid: "bg-green-100 text-green-800 hover:bg-green-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    overdue: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  const statusLabels = {
    paid: "Pagada",
    pending: "Pendiente",
    overdue: "Vencida",
  };

  return (
    <Badge variant="outline" className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  );
};

const ClientInvoicesPage = () => {
  const invoices: Invoice[] = [
    { id: "F001-00001", date: "2023-05-18", dueDate: "2023-06-17", total: 4500.00, status: "paid" },
    { id: "F001-00002", date: "2023-06-25", dueDate: "2023-07-25", total: 2800.50, status: "pending" },
    { id: "F001-00003", date: "2023-07-10", dueDate: "2023-08-09", total: 1600.00, status: "pending" },
    { id: "F001-00004", date: "2023-08-15", dueDate: "2023-09-14", total: 5200.25, status: "overdue" },
    { id: "F001-00005", date: "2023-09-30", dueDate: "2023-10-30", total: 3700.75, status: "paid" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Facturas</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Factura</TableHead>
                <TableHead>Fecha de Emisión</TableHead>
                <TableHead>Fecha de Vencimiento</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>S/ {invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Ver detalles</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Descargar factura</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientInvoicesPage;

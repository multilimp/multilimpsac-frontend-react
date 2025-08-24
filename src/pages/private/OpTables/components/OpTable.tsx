import AntTable, { AntColumnType } from '@/components/AntTable';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { IconButton, Button } from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';

interface OpTableProps {
  data: Array<ProviderOrderProps>;
  loading: boolean;
  onRowClick: (op: ProviderOrderProps) => void;
  onReload?: () => void | Promise<void>;
}

interface OpDataTable {
  id: number;
  rawdata: ProviderOrderProps;
  codigoOp: string;
  proveedorRuc: string;
  proveedorNombre: string;
  ordenCompraId: number;
  codigoVenta: string;
  clienteRuc: string;
  clienteNombre: string;
  contactoProveedorNombre: string;
  contactoProveedorCargo: string;
  fechaDespacho: string;
  fechaProgramada: string;
  fechaRecepcion: string;
  totalProveedor: string;
}

const defaultText = 'N/A';

const OpTable = ({ data, loading, onRowClick, onReload }: OpTableProps) => {
  const formattedData: Array<OpDataTable> = data.map((item) => ({
    id: item.id,
    rawdata: item,
    codigoOp: item.codigoOp,
    proveedorRuc: item.proveedor?.ruc ?? defaultText,
    proveedorNombre: item.proveedor?.razonSocial ?? defaultText,
    ordenCompraId: item.ordenCompraId ?? 0,
    codigoVenta: item.ordenCompra?.codigoVenta ?? defaultText,
    clienteRuc: item.ordenCompra?.cliente?.ruc ?? defaultText,
    clienteNombre: item.ordenCompra?.cliente?.razonSocial ?? defaultText,
    contactoProveedorNombre: item.contactoProveedor?.nombre ?? defaultText,
    contactoProveedorCargo: item.contactoProveedor?.cargo ?? defaultText,
    fechaDespacho: formattedDate(item.fechaDespacho, undefined, defaultText),
    fechaProgramada: formattedDate(item.fechaProgramada, undefined, defaultText),
    fechaRecepcion: formattedDate(item.fechaRecepcion, undefined, defaultText),
    totalProveedor: item.totalProveedor ? formatCurrency(parseFloat(item.totalProveedor)) : defaultText,
  }));

  const columns: Array<AntColumnType<OpDataTable>> = [
    {
      title: 'Código OP',
      dataIndex: 'codigoOp',
      width: 200,
      render: (value, record) => (
        <Button
          variant="contained"
          onClick={() => {
            onRowClick(record.rawdata);
          }}
          startIcon={<Visibility />}
          size="small"
          color="info"
          style={{ width: '100%' }}
        >
          {value}
        </Button>
      )
    },
    { title: 'RUC Proveedor', dataIndex: 'proveedorRuc', width: 150, filter: true, sort: true },
    { title: 'Nombre Proveedor', dataIndex: 'proveedorNombre', width: 200, filter: true, sort: true },
    { title: 'Código OC', dataIndex: 'codigoVenta', width: 150, filter: true, sort: true },
    { title: 'RUC Cliente', dataIndex: 'clienteRuc', width: 150, filter: true, sort: true },
    { title: 'Nombre Cliente', dataIndex: 'clienteNombre', width: 200, filter: true, sort: true },
    { title: 'Contacto Proveedor', dataIndex: 'contactoProveedorNombre', width: 150, filter: true, sort: true },
    { title: 'Cargo Contacto', dataIndex: 'contactoProveedorCargo', width: 150, filter: true, sort: true },
    { title: 'Fecha Despacho', dataIndex: 'fechaDespacho', width: 150, filter: true, sort: true },
    { title: 'Fecha Programada', dataIndex: 'fechaProgramada', width: 150, filter: true, sort: true },
    { title: 'Fecha Recepción', dataIndex: 'fechaRecepcion', width: 150, filter: true, sort: true },
    { title: 'Total Proveedor', dataIndex: 'totalProveedor', width: 150, filter: true, sort: true },
  ];

  return (
    <AntTable
      columns={columns}
      data={formattedData}
      loading={loading}
      onReload={onReload}
    />
  );
};

export default OpTable;

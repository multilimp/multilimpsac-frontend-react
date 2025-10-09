import AntTable, { AntColumnType } from '@/components/AntTable';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { IconButton, Button, Box, Chip } from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';
import { ESTADOS, EstadoVentaType, ESTADO_ROL_COLORS } from '@/utils/constants';

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
  estadoRolOp: EstadoVentaType;
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
    estadoRolOp: item.estadoRolOp || 'PENDIENTE',
  }));

  const getStatusBackgroundColor = (status: string) => {
    const normalizedStatus = status?.toUpperCase() as keyof typeof ESTADO_ROL_COLORS;
    return ESTADO_ROL_COLORS[normalizedStatus] || ESTADO_ROL_COLORS.PENDIENTE;
  };

  const columns: Array<AntColumnType<OpDataTable>> = [
    {
      title: '',
      dataIndex: 'estadoRolOp',
      width: 20,
      render: (value: string) => (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '60px',
            backgroundColor: `${getStatusBackgroundColor(value)} !important`,
            margin: '-16px !important',
            padding: '6px !important',

            '&:hover': {
              backgroundColor: `${getStatusBackgroundColor(value)} !important`,
              opacity: '0.9 !important',
            }
          }}
        />
      ),
    },
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
    {
      title: 'Estado',
      dataIndex: 'estadoRolOp',
      width: 150,
      filter: true,
      sort: true,
      render: (value: EstadoVentaType) => {
        const estado = ESTADOS[value];
        return (
          <Chip
            label={estado.label}
            sx={{
              backgroundColor: estado.color,
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              borderRadius: 1.5,
              boxShadow: `0 0 10px ${estado.color}60`,
            }}
          />
        );
      }
    },
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

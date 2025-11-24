import AntTable, { AntColumnType } from '@/components/AntTable';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { Button, Box, Chip } from '@mui/material';
import { Visibility, PictureAsPdf } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { ESTADOS, EstadoVentaType, ESTADO_ROL_COLORS } from '@/utils/constants';

type TransportePagoItem = {
  fechaPago?: string | null;
  montoPago?: number | null;
};

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
  clienteDepartamento: string;
  contactoProveedorNombre: string;
  contactoProveedorCargo: string;
  fechaDespacho: string;
  fechaProgramada: string;
  fechaRecepcion: string;
  totalProveedor: string;
  totalVenta: string;
  transporteRuc: string;
  transporteNombre: string;
  numeroFacturaTransporte: string;
  numeroGuiaTransporte: string;
  fleteCotizado: string;
  fletePagado: string;
  transporteFechaPago: string;
  fechaMaximaEntrega: string;
  tipoEntrega: string;
  tipoPago: string | null;
  ordenCompraElectronica: string;
  ordenCompraFisica: string;
  estadoRolOp: EstadoVentaType;
}

const defaultText = ' ';

const OpTable = ({ data, loading, onRowClick, onReload }: OpTableProps) => {
  const formattedData: Array<OpDataTable> = data.map((item) => {
    const transporte = Array.isArray(item.transportesAsignados) && item.transportesAsignados.length > 0 ? item.transportesAsignados[0] : undefined;
    const pagosTransporte: TransportePagoItem[] = Array.isArray(transporte?.pagos) ? (transporte?.pagos as TransportePagoItem[]) : [];
    let fechaPagoUltima = '';
    for (const p of pagosTransporte) {
      const d = p.fechaPago ? new Date(p.fechaPago) : null;
      if (!d) continue;
      const accDate = fechaPagoUltima ? new Date(fechaPagoUltima) : null;
      if (!accDate || d > accDate) fechaPagoUltima = d.toISOString();
    }

    return {
      id: item.id,
      rawdata: item,
      codigoOp: item.codigoOp,
      proveedorRuc: item.proveedor?.ruc ?? defaultText,
      proveedorNombre: item.proveedor?.razonSocial ?? defaultText,
      ordenCompraId: item.ordenCompraId ?? 0,
      codigoVenta: item.ordenCompra?.codigoVenta ?? defaultText,
      clienteRuc: item.ordenCompra?.cliente?.ruc ?? defaultText,
      clienteNombre: item.ordenCompra?.cliente?.razonSocial ?? defaultText,
      clienteDepartamento: item.ordenCompra?.departamentoEntrega ?? defaultText,
      ordenCompraCodigo: item.ordenCompra?.codigoVenta ?? defaultText,
      contactoProveedorNombre: item.contactoProveedor?.nombre ?? defaultText,
      contactoProveedorCargo: item.contactoProveedor?.cargo ?? defaultText,
      fechaDespacho: formattedDate(item.fechaDespacho, undefined, defaultText),
      fechaProgramada: formattedDate(item.fechaProgramada, undefined, defaultText),
      fechaEntrega: formattedDate(item.fechaEntrega, undefined, defaultText),
      fechaRecepcion: formattedDate(item.fechaRecepcion, undefined, defaultText),
      totalProveedor: item.totalProveedor ? formatCurrency(parseFloat(item.totalProveedor)) : defaultText,
      totalVenta: item.ordenCompra?.montoVenta ? formatCurrency(parseFloat(item.ordenCompra?.montoVenta)) : defaultText,
      transporteRuc: transporte?.transporte?.ruc ?? defaultText,
      transporteNombre: transporte?.transporte?.razonSocial ?? defaultText,
      numeroFacturaTransporte: transporte?.numeroFactura ?? defaultText,
      numeroGuiaTransporte: transporte?.grt ?? defaultText,
      fleteCotizado: transporte?.montoFlete ? formatCurrency(Number(transporte?.montoFlete)) : defaultText,
      fletePagado: transporte?.montoFlete ? formatCurrency(Number(transporte?.montoFletePagado)) : defaultText,
      fechaEntregaOc: formattedDate(item.ordenCompra?.fechaEntregaOc, undefined, defaultText),
      transporteFechaPago: formattedDate(fechaPagoUltima, undefined, defaultText),
      fechaMaximaEntrega: formattedDate(item.ordenCompra?.fechaMaxForm, undefined, defaultText),
      tipoEntrega: transporte?.tipoDestino ?? defaultText,
      estadoRolOp: item.estadoRolOp,
      tipoPago: item.tipoPago || null,
      ordenCompraElectronica: item.ordenCompra?.documentoOce,
      ordenCompraFisica: item.ordenCompra?.documentoOcf,
    } as OpDataTable;
  });

  const getStatusBackgroundColor = (status: string) => {
    const normalizedStatus = typeof status === 'string' ? status.toUpperCase() as keyof typeof ESTADO_ROL_COLORS : 'PENDIENTE';
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
          component={Link}
          to={record.rawdata?.id ? `/provider-orders/${record.rawdata.id}` : '#'}
          startIcon={<Visibility />}
          size="small"
          color="info"
          style={{ width: '100%' }}
          disabled={!record.rawdata?.id}
        >
          {value}
        </Button>
      )
    },
    { title: 'Código OC', dataIndex: 'codigoVenta', width: 150, filter: true, sort: true },
    { title: 'RUC Cliente', dataIndex: 'clienteRuc', width: 150, filter: true, sort: true },
    { title: 'Razón Social Cliente', dataIndex: 'clienteNombre', width: 200, filter: true, sort: true },

    {
      title: 'OCE',
      dataIndex: 'ordenCompraElectronica',
      width: 150,
      document: true,
    },
    {
      title: 'OCF',
      dataIndex: 'ordenCompraFisica',
      width: 150,
      document: true,
    },
    { title: 'OC Importe Total', dataIndex: 'totalVenta', width: 150, filter: true, sort: true },
    { title: 'Cliente Departamento', dataIndex: 'clienteDepartamento', width: 150, filter: true, sort: true },
    { title: 'RUC Proveedor', dataIndex: 'proveedorRuc', width: 150, filter: true, sort: true },
    { title: 'Razón Social Proveedor', dataIndex: 'proveedorNombre', width: 200, filter: true, sort: true },
    { title: 'Estado Pago Proveedor', dataIndex: 'tipoPago', width: 150, filter: true, sort: true },

    { title: 'RUC Transporte', dataIndex: 'transporteRuc', width: 150, filter: true, sort: true },
    { title: 'Transporte Razón Social', dataIndex: 'transporteNombre', width: 200, filter: true, sort: true },
    { title: 'Numero de Factura Transporte', dataIndex: 'numeroFacturaTransporte', width: 180, filter: true, sort: true },
    { title: 'Número de Guia Transporte', dataIndex: 'numeroGuiaTransporte', width: 180, filter: true, sort: true },
    { title: 'Flete Cotizado', dataIndex: 'fleteCotizado', width: 150, filter: true, sort: true },
    { title: 'Flete Pagado', dataIndex: 'fletePagado', width: 150, filter: true, sort: true },
    { title: 'Transporte Fecha de Pago', dataIndex: 'transporteFechaPago', width: 180, filter: true, sort: true },

    { title: 'Fecha Maxima de Entrega', dataIndex: 'fechaMaximaEntrega', width: 180, filter: true, sort: true },
    { title: 'Fecha Recepción', dataIndex: 'fechaRecepcion', width: 150, filter: true, sort: true },
    { title: 'Fecha de Programación', dataIndex: 'fechaProgramada', width: 150, filter: true, sort: true },
    { title: 'Fecha Despacho', dataIndex: 'fechaDespacho', width: 150, filter: true, sort: true },
    { title: 'Fecha de Entrega', dataIndex: 'fechaEntregaOc', width: 150, filter: true, sort: true },
    { title: 'Tipo de Entrega', dataIndex: 'tipoEntrega', width: 150, filter: true, sort: true },
    {
      title: 'Estado',
      dataIndex: 'estadoRolOp',
      width: 150,
      filter: true,
      sort: true,
      render: (value: EstadoVentaType) => {
        const estado = ESTADOS[value] || ESTADOS.PENDIENTE;
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

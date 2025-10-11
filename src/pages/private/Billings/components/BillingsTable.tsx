import { useMemo } from 'react';
import { Button, Box, IconButton, Tooltip } from '@mui/material';
import { Visibility, PictureAsPdf } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency, formattedDate } from '@/utils/functions';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { ESTADO_ROL_COLORS, ESTADO_ROL_LABELS } from '@/utils/constants';

interface BillingsTableProps {
  data: SaleProps[];
  loading: boolean;
  onReload?: () => void;
}

const defaultText = 'N/A';

const BillingsTable: React.FC<BillingsTableProps> = ({ data, loading, onReload }) => {

  const getStatusBackgroundColor = (status: string | null | undefined) => {
    if (!status || typeof status !== 'string') {
      return ESTADO_ROL_COLORS.PENDIENTE;
    }
    const normalizedStatus = status.toUpperCase() as keyof typeof ESTADO_ROL_COLORS;
    return ESTADO_ROL_COLORS[normalizedStatus] || ESTADO_ROL_COLORS.PENDIENTE;
  };

  const getStatusLabel = (status: string | null | undefined) => {
    if (!status || typeof status !== 'string') {
      return ESTADO_ROL_LABELS.PENDIENTE;
    }
    const normalizedStatus = status.toUpperCase() as keyof typeof ESTADO_ROL_LABELS;
    return ESTADO_ROL_LABELS[normalizedStatus] || ESTADO_ROL_LABELS.PENDIENTE;
  };

  const formattedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      codigo_venta: item.codigoVenta || defaultText,
      razon_social_cliente: item?.cliente?.razonSocial ?? defaultText,
      ruc_cliente: item?.cliente?.ruc ?? defaultText,
      ruc_empresa: item?.empresa?.ruc ?? defaultText,
      razon_social_empresa: item?.empresa?.razonSocial ?? defaultText,
      contacto: item?.contactoCliente?.nombre ?? defaultText,
      fecha_formalizacion: formattedDate(item.fechaForm, undefined, defaultText),
      fecha_max_entrega: formattedDate(item.fechaEntrega, undefined, defaultText),
      fecha_programacion: formattedDate(item.fechaPeruCompras, undefined, defaultText),
      monto_venta: formatCurrency(item.montoVenta ? parseInt(item.montoVenta, 10) : 0),
      fecha_factura: formattedDate(item.fechaEmision, undefined, defaultText),
      numero_factura: item.codigoVenta || defaultText,
      grr: item.siaf || defaultText,
      codigo_ocf: item.codigoOcf || defaultText,
      oce: item.documentoOce || null,
      ocf: item.documentoOcf || null,
      estado_facturacion: String(item.estadoFacturacion || 'PENDIENTE'),
      estado_indicador: String(item.estadoFacturacion || 'PENDIENTE'),
      refact: item.ventaPrivada ? 'Sí' : 'No',
      rawdata: item,
    }));
  }, [data]);

  const columns: Array<AntColumnType<any>> = [
    {
      title: '',
      dataIndex: 'estado_indicador',
      width: 30,
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
      title: 'Código OC',
      dataIndex: 'codigo_venta',
      width: 200,
      render: (value, record) => {
        if (!record?.rawdata?.id) {
          return <span>{value}</span>;
        }
        return (
          <Button
            component={Link}
            to={`/billing/${record.rawdata.id}`}
            variant="contained"
            startIcon={<Visibility />}
            size="small"
            color="info"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            {value}
          </Button>
        );
      }
    },
    { title: 'Razón Social Cliente', dataIndex: 'razon_social_cliente', width: 200, sort: true, filter: true },
    { title: 'RUC Cliente', dataIndex: 'ruc_cliente', width: 150, sort: true, filter: true },
    { title: 'RUC Empresa', dataIndex: 'ruc_empresa', width: 150, sort: true, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'razon_social_empresa', width: 200, sort: true, filter: true },
    { title: 'Contacto', dataIndex: 'contacto', width: 200, sort: true, filter: true },
    { title: 'Fecha Registro', dataIndex: 'fecha_formalizacion', width: 150, sort: true, filter: true },
    { title: 'Fecha Programación', dataIndex: 'fecha_programacion', width: 150, sort: true, filter: true },
    { title: 'Monto Venta', dataIndex: 'monto_venta', width: 130, sort: true, filter: true },
    { title: 'Fecha Factura', dataIndex: 'fecha_factura', width: 150, sort: true, filter: true },
    { title: 'GRR', dataIndex: 'grr', width: 100, sort: true, filter: true },
    { title: 'Código OCF', dataIndex: 'codigo_ocf', width: 120, sort: true, filter: true },
    {
      title: 'OCE',
      dataIndex: 'oce',
      width: 80,
      align: 'center',
      render: (value) =>
        value ? (
          <Tooltip title="Ver Orden de Compra Electrónica" placement="top">
            <IconButton
              color="error"
              component="a"
              href={value}
              target="_blank"
              size="small"
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(211, 47, 47, 0.08)'
                }
              }}
            >
              <PictureAsPdf />
            </IconButton>
          </Tooltip>
        ) : (
          <Box sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>-</Box>
        ),
    },
    {
      title: 'OCF',
      dataIndex: 'ocf',
      width: 80,
      align: 'center',
      render: (value) =>
        value ? (
          <Tooltip title="Ver Orden de Compra Física" placement="top">
            <IconButton
              color="error"
              component="a"
              href={value}
              target="_blank"
              size="small"
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(211, 47, 47, 0.08)'
                }
              }}
            >
              <PictureAsPdf />
            </IconButton>
          </Tooltip>
        ) : (
          <Box sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>-</Box>
        ),
    },
    {
      title: 'Estado Facturación',
      dataIndex: 'estado_facturacion',
      width: 150,
      sort: true,
      filter: true,
      render: (value: string) => {
        const bgColor = getStatusBackgroundColor(value);

        return (
          <Box
            sx={{
              width: '100%',
              backgroundColor: bgColor,
              color: 'white',
              textAlign: 'center',
              borderRadius: '4px',
              padding: '6px 16px',
              fontWeight: 600,
              fontSize: '0.8125rem',
              textTransform: 'none',
              boxShadow: `0 2px 8px ${bgColor}40`,
              cursor: 'default',
              transition: 'all 0.2s ease',

              '&:hover': {
                opacity: 0.9,
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${bgColor}60`,
              }
            }}
          >
            {getStatusLabel(value)}
          </Box>
        );
      },
    },
  ];

  return (
    <AntTable
      data={formattedData}
      columns={columns}
      loading={loading}
      scroll={{ x: 2650 }}
      size="small"
      onReload={onReload}
      rowKey="id"
    />
  );
};

export default BillingsTable;

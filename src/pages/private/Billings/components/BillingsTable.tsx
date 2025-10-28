import { useMemo, useState } from 'react';
import { Button, Box, IconButton, Tooltip } from '@mui/material';
import { Visibility, PictureAsPdf, Contacts } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { formatCurrency, formattedDate } from '@/utils/functions';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { ESTADO_ROL_COLORS, ESTADO_ROL_LABELS } from '@/utils/constants';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';
// import { BillingProps } from '@/services/billings/billings';

interface BillingsTableProps {
  data: SaleProps[];
  loading: boolean;
  onReload?: () => void;
}

const defaultText = '';

const BillingsTable: React.FC<BillingsTableProps> = ({ data, loading, onReload }) => {
  const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  // Eliminado cache de billing, usaremos facturaciones[0] provistas en ventas

  const handleOpenContactsDrawer = (clientId: number, title: string) => {
    setSelectedClientId(clientId);
    setSelectedTitle(title);
    setContactsDrawerOpen(true);
  };

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

    return data.map((item) => {
      const firstBilling = Array.isArray(item.facturaciones) && item.facturaciones.length > 0
        ? item.facturaciones[0]
        : item.facturacion
          ? { factura: item.facturacion.factura, fechaFactura: item.facturacion.fechaFactura, grr: item.facturacion.grr }
          : null;

      const refactFirst = Array.isArray(item.facturaciones) && item.facturaciones.length > 0
        ? item.facturaciones.find((f: unknown) => {
          if (typeof f === 'object' && f !== null && 'esRefacturacion' in f) {
            const v = f as { esRefacturacion?: boolean };
            return !!v.esRefacturacion;
          }
          return false;
        })
        : undefined;

      const numeroFactura = firstBilling?.factura ?? defaultText;
      const fechaFactura = formattedDate(firstBilling?.fechaFactura, undefined, defaultText);
      const grrValue = firstBilling?.grr ?? defaultText;


      return {
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
        fecha_recepcion: formattedDate(item.fechaEntrega, undefined, defaultText),
        fecha_factura: fechaFactura,
        fecha_entrega_oc: formattedDate(item.fechaEntregaOc, undefined, defaultText),
        numero_factura: numeroFactura,
        etapa_siaf: item.etapaSiaf || defaultText,
        grr: grrValue,
        codigo_ocf: item.codigoOcf || defaultText,
        oce: item.documentoOce || null,
        ocf: item.documentoOcf || null,
        carta_ampliacion: item.cartaAmpliacion || null,
        estado_facturacion: String(item.estadoFacturacion || 'PENDIENTE'),
        estado_indicador: String(item.estadoFacturacion || 'PENDIENTE'),
        refact: refactFirst?.factura ?? defaultText,
        rawdata: item,
      };
    });
  }, [data]);

  interface BillingsRow {
    id: string | number | undefined;
    rawdata: SaleProps;
    codigo_venta: string;
    estado_indicador: string;
    razon_social_cliente: string;
    ruc_cliente: string;
    ruc_empresa: string;
    razon_social_empresa: string;
    contacto: string;
    fecha_formalizacion: string;
    fecha_max_entrega: string;
    fecha_programacion: string;
    monto_venta: string;
    fecha_factura: string;
    fecha_entrega_oc: string;
    numero_factura: string;
    etapa_siaf: string;
    grr: string;
    codigo_ocf: string;
    oce: string | null;
    ocf: string | null;
    carta_ampliacion: string | null;
    refact: string;
  }
  const columns: Array<AntColumnType<BillingsRow>> = [
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
      render: (value, record: BillingsRow) => {
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
    { title: 'Razón Social Cliente', dataIndex: 'razon_social_cliente', width: 250, sort: true, filter: true },
    { title: 'RUC Cliente', dataIndex: 'ruc_cliente', width: 150, sort: true, filter: true },
    { title: 'RUC Empresa', dataIndex: 'ruc_empresa', width: 150, sort: true, filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'razon_social_empresa', width: 250, sort: true, filter: true },
    {
      title: 'Contactos',
      dataIndex: 'id',
      width: 120,
      align: 'center',
      render: (_: unknown, record) => (
        <Tooltip title="Ver contactos del cliente">
          <Button
            variant="outlined"
            startIcon={<Contacts />}
            onClick={() => handleOpenContactsDrawer(record.rawdata.clienteId, `${record.razon_social_cliente} - ${record.ruc_cliente}`)}
            size="small"
            color="primary"
          >
            Ver
          </Button>
        </Tooltip>
      ),
    },
    { title: 'Fecha Form', dataIndex: 'fecha_formalizacion', width: 150, sort: true, filter: true },
    { title: 'Fecha Max Entrega', dataIndex: 'fecha_max_entrega', width: 150, sort: true, filter: true },

    { title: 'Fecha Entrega OC', dataIndex: 'fecha_entrega_oc', width: 150, sort: true, filter: true },
    {
      title: 'Monto Venta', dataIndex: 'monto_venta', width: 150, sort: true, filter: true,
    },
    {
      title: 'OCE', dataIndex: 'oce', width: 80, sort: true, filter: true, align: 'center',
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
      title: 'Codigo OCF',
      dataIndex: 'id',
      width: 'auto',
      render: (_: unknown, record: BillingsRow) => {
        const full = record.rawdata?.codigoOcf || '';
        const afterHyphen = full.includes('-') ? full.split('-').slice(1).join('-').trim() : full;
        return afterHyphen || defaultText;
      }
    }, {
      title: 'Carta Ampliación',
      dataIndex: 'carta_ampliacion',
      width: 120,
      align: 'center',
      render: (value) =>
        value ? (
          <Tooltip title="Ver Carta de Ampliación" placement="top">
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
    { title: 'Fecha Recepción', dataIndex: 'fecha_recepcion', width: 120, sort: true, filter: true },
    { title: 'Fecha Programación', dataIndex: 'fecha_programacion', width: 150, sort: true, filter: true },
    { title: 'Etapa SIAF', dataIndex: 'etapa_siaf', width: 150, sort: true, filter: true },
    {
      title: 'Número Factura',
      dataIndex: 'numero_factura',
      width: 150,
      sort: true,
      filter: true,
    },
    { title: 'Fecha Factura', dataIndex: 'fecha_factura', width: 150, sort: true, filter: true },
    { title: 'GRR', dataIndex: 'grr', width: 150, sort: true, filter: true },
    { title: 'Refact', dataIndex: 'refact', width: 150, sort: true, filter: true },
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
    <>
      <AntTable
        data={formattedData}
        columns={columns}
        loading={loading}
        scroll={{ x: 2650 }}
        size="small"
        onReload={onReload}
        rowKey="id"
      />
      {contactsDrawerOpen && selectedClientId && (
        <ContactsDrawer
          handleClose={() => setContactsDrawerOpen(false)}
          tipo={ContactTypeEnum.CLIENTE}
          referenceId={selectedClientId!}
          title={selectedTitle}
          readOnly={true}
        />
      )}
    </>
  );
};

export default BillingsTable;

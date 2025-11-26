import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { IconButton, Button, Box, Chip, Tooltip } from '@mui/material';
import { PictureAsPdf, Visibility, Contacts } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { ESTADOS_SEGUIMIENTO, ESTADO_SEGUIMIENTO_COLORS, EstadoSeguimientoType } from '@/utils/constants';
import { useState } from 'react';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';
import { calcularUtilidadCompleta } from '@/utils/utilidadCalculator';

interface TrackingsTableProps {
  data: Array<SaleProps>;
  loading: boolean;
  onRowClick?: (sale: SaleProps) => void;
  onReload?: () => void | Promise<void>;
}

interface TrackingsDataTable {
  id: number;
  rawdata: SaleProps;
  codigoVenta: string;
  clienteRuc: string;
  clienteNombre: string;
  empresaRuc: string;
  empresaNombre: string;
  contactoCargo: string;
  contactoNombre: string;
  catalogoNombre: string;
  catalogoDescripcion: string;
  fechaEmision: string;
  fechaMaxForm: string;
  fechaPeruCompras: string;
  fechaEntregaOc: string;
  montoVenta: string;
  cartaAmpliacion?: string | null;
  codigoOcf?: string | undefined;
  cue: string;
  departamentoEntrega: string;
  departamentoCliente?: string;
  estadoRolSeguimiento: EstadoSeguimientoType;
  numeroFactura: string;
  fechaFactura: string;
  grr: string;
  refact: string;
  fuera_plazo: string;
}

const defaultText = '';
export const TrackingsTable = ({ data, loading, onRowClick, onReload }: TrackingsTableProps) => {
  const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const handleOpenContactsDrawer = (clientId: number, title: string) => {
    setSelectedClientId(clientId);
    setSelectedTitle(title);
    setContactsDrawerOpen(true);
  };

  const formattedData: Array<TrackingsDataTable> = data.map((item) => {
    const firstBilling = Array.isArray(item.facturaciones) && item.facturaciones.length > 0
      ? item.facturaciones[0]
      : item.facturacion
        ? { factura: item.facturacion.factura, fechaFactura: item.facturacion.fechaFactura, grr: item.facturacion.grr }
        : null;

    const numeroFactura = firstBilling?.factura ?? defaultText;
    const fechaFactura = formattedDate(firstBilling?.fechaFactura, undefined, defaultText);
    const grrValue = firstBilling?.grr ?? defaultText;

    const refactFirst = Array.isArray(item.facturaciones)
      ? item.facturaciones.find((f) => !!f?.esRefacturacion)
      : undefined;
    const refactNumero = refactFirst && typeof refactFirst === 'object' && refactFirst !== null && 'factura' in refactFirst
      ? (((refactFirst as { factura?: string | null }).factura) ?? defaultText)
      : defaultText;

    const departamentoCliente = typeof item?.cliente?.departamento === 'string'
      ? item?.cliente?.departamento
      : ((item?.cliente?.departamento as { nombre?: string } | undefined)?.nombre ?? defaultText);

    // Normalizar codigoOcf para que el filtro actúe sobre el texto posterior al primer guion
    const fullCodigoOcf = item?.codigoOcf || '';
    const codigoOcfValue = fullCodigoOcf.includes('-')
      ? fullCodigoOcf.split('-').slice(1).join('-').trim()
      : fullCodigoOcf;

    // Calcular si está fuera de plazo para el filtro
    const entrega = item?.fechaEntregaOc || item?.fechaEntrega;
    const max = item?.fechaMaxForm;
    let fueraPlazoValue = '-';
    if (entrega && max) {
      const entregaTime = new Date(entrega).getTime();
      const maxTime = new Date(max).getTime();
      if (!Number.isNaN(entregaTime) && !Number.isNaN(maxTime)) {
        fueraPlazoValue = entregaTime > maxTime ? 'Sí' : 'No';
      }
    }

    return {
      id: item.id,
      rawdata: item,
      codigoVenta: item.codigoVenta,
      clienteRuc: item?.cliente?.ruc ?? defaultText,
      clienteNombre: item?.cliente?.razonSocial ?? defaultText,
      empresaRuc: item?.empresa?.ruc ?? defaultText,
      empresaNombre: item?.empresa?.razonSocial ?? defaultText,
      contactoCargo: item?.contactoCliente?.cargo ?? defaultText,
      contactoNombre: item?.contactoCliente?.nombre ?? defaultText,
      catalogoNombre: item?.catalogoEmpresa?.nombre ?? defaultText,
      catalogoDescripcion: item?.catalogoEmpresa?.descripcion ?? defaultText,
      fechaEmision: formattedDate(item?.fechaEmision, undefined, defaultText),
      fechaMaxForm: formattedDate(item?.fechaMaxForm, undefined, defaultText),
      fechaPeruCompras: formattedDate(item?.fechaPeruCompras, undefined, defaultText),
      fechaEntregaOc: formattedDate(item?.fechaEntregaOc, undefined, defaultText),
      montoVenta: formatCurrency(parseInt(item?.montoVenta ?? '0', 10)),
      cartaAmpliacion: item?.cartaAmpliacion,
      codigoOcf: codigoOcfValue,
      cue: item?.cliente?.codigoUnidadEjecutora ?? defaultText,
      oce: item?.documentoOce,
      ocf: item?.documentoOcf,
      peruCompras: item?.documentoPeruCompras,
      departamentoEntrega: item?.departamentoEntrega ?? defaultText,
      departamentoCliente: departamentoCliente,
      estadoRolSeguimiento: (item?.estadoRolSeguimiento ?? 'PENDIENTE') as EstadoSeguimientoType,
      numeroFactura,
      fechaFactura,
      grr: grrValue,
      refact: refactNumero,
      fuera_plazo: fueraPlazoValue,
    };
  });

  const getStatusBackgroundColor = (value: EstadoSeguimientoType | string | null | undefined) => {
    const key = (value || 'PENDIENTE') as EstadoSeguimientoType;
    return (ESTADO_SEGUIMIENTO_COLORS as Record<string, string>)[key] || '#64748b';
  };

  const columns: Array<AntColumnType<TrackingsDataTable>> = [
    {
      title: '',
      dataIndex: 'estadoRolSeguimiento',
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
      title: 'Código OC',
      dataIndex: 'codigoVenta',
      width: 200,
      filter: true,
      sort: true,
      render: (value, record) => {
        if (!record?.rawdata?.id) {
          return <span>{value}</span>;
        }
        return (<Button
          variant="contained"
          component={Link}
          to={`/tracking/${record.id}`}
          startIcon={< Visibility />}
          size="small"
          color="info"
          style={{ width: '100%' }}
        >
          {value}
        </Button >)
      }
    },
    { title: 'RUC Cliente', dataIndex: 'clienteRuc', width: 150, filter: true, sort: true },
    { title: 'Razón social Cliente', dataIndex: 'clienteNombre', width: 250, filter: true, sort: true },
    { title: 'RUC Empresa', dataIndex: 'empresaRuc', width: 150, filter: true, sort: true },
    { title: 'Razón social Empresa', dataIndex: 'empresaNombre', width: 250, filter: true, sort: true },
    {
      title: 'Cargo Contacto',
      dataIndex: 'contactoCargo',
      width: 180,
      align: 'center',
      filter: false,
      sort: false,
      render: (_: unknown, record) => (
        <Tooltip title="Ver contactos del cliente">
          <Button
            variant="outlined"
            startIcon={<Contacts />}
            onClick={() => handleOpenContactsDrawer(record.rawdata.clienteId, `${record.clienteNombre} - ${record.clienteRuc}`)}
            size="small"
            color="primary"
          >
            Ver
          </Button>
        </Tooltip>
      ),
    },
    { title: 'Monto Venta', dataIndex: 'montoVenta', width: 150, filter: true, sort: true },
    { title: 'Departamento Cliente', dataIndex: 'departamentoCliente', width: 150, filter: true, sort: true },
    {
      title: 'OCE',
      dataIndex: 'oce',
      width: 100,
      document: true,
    },
    {
      title: 'OCF',
      dataIndex: 'ocf',
      width: 100,
      document: true,
    },
    {
      title: 'Codigo OCF',
      dataIndex: 'codigoOcf',
      width: 'auto',
      sort: true,
      filter: true,
    },
    { title: 'Número Factura', dataIndex: 'numeroFactura', width: 150, filter: true, sort: true },
    { title: 'Fecha Factura', dataIndex: 'fechaFactura', width: 150, filter: true, sort: true },
    { title: 'GRR', dataIndex: 'grr', width: 150, filter: true, sort: true },
    { title: 'Refact', dataIndex: 'refact', width: 150, filter: true, sort: true },
    { title: 'Fecha Máxima Entrega', dataIndex: 'fechaMaxForm', width: 150, filter: true, sort: true },
    { title: 'Fecha Entrega OC', dataIndex: 'fechaEntregaOc', width: 150, filter: true, sort: true },
    { title: 'Fecha Perú Compras', dataIndex: 'fechaPeruCompras', width: 150, filter: true, sort: true },
    {
      title: 'Perú Compras', dataIndex: 'peruCompras', width: 150,
      document: true,
    },
    {
      title: 'Carta Ampliación',
      dataIndex: 'cartaAmpliacion',
      width: 100,
      document: true,
    },
    {
      title: 'Fuera de plazo',
      dataIndex: 'fuera_plazo',
      width: 140,
      filter: true,
      align: 'center',
      render: (_: unknown, record: TrackingsDataTable) => {
        const entrega = record.rawdata?.fechaEntregaOc || record.rawdata?.fechaEntrega;
        const max = record.rawdata?.fechaMaxForm;
        if (!entrega || !max) {
          return <span>-</span>;
        }
        const entregaTime = new Date(entrega).getTime();
        const maxTime = new Date(max).getTime();
        if (Number.isNaN(entregaTime) || Number.isNaN(maxTime)) {
          return <span>-</span>;
        }
        const fuera = entregaTime > maxTime;
        return (
          <Box
            sx={{
              bgcolor: fuera ? '#ef4444' : '#22c55e',
              color: '#fff',
              borderRadius: '4px',
              px: 1.25,
              py: 0.5,
              fontWeight: 600,
              fontSize: '0.75rem',
              textAlign: 'center',
            }}
          >
            {fuera ? 'Sí' : 'No'}
          </Box>
        );
      },
    },
    {
      title: 'Utilidad %',
      dataIndex: 'utilidad',
      filter: false,
      width: 220,
      align: 'center',
      render: (_: unknown, record: TrackingsDataTable) => {
        if (!record?.rawdata) {
          return <span>-</span>;
        }

        const montoVenta = record.rawdata.montoVenta;
        const totalProveedores = record.rawdata.ordenesProveedor?.reduce((sum, op) => {
          const total = typeof op.totalProveedor === 'string'
            ? parseFloat(op.totalProveedor)
            : (op.totalProveedor || 0);
          return sum + total;
        }, 0) || 0;

        const utilidad = calcularUtilidadCompleta(montoVenta, totalProveedores);

        return (
          <Chip
            label={utilidad.mensaje}
            sx={{
              backgroundColor: utilidad.color === 'success' ? '#22c55e' :
                utilidad.color === 'error' ? '#ef4444' : '#9ca3af',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              borderRadius: 1.5,
              boxShadow: utilidad.color === 'success' ? '0 0 10px #22c55e60' :
                utilidad.color === 'error' ? '0 0 10px #ef444460' : 'none',
            }}
          />
        );
      },
    },
    {
      title: 'Estado',
      dataIndex: 'estadoRolSeguimiento',
      width: 150,
      sort: true,
      filter: true,
      render: (value: EstadoSeguimientoType | null | undefined) => {
        const estado = value && value in ESTADOS_SEGUIMIENTO ? ESTADOS_SEGUIMIENTO[value as keyof typeof ESTADOS_SEGUIMIENTO] : ESTADOS_SEGUIMIENTO.PENDIENTE;
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
    <>
      <AntTable
        columns={columns}
        data={formattedData}
        loading={loading}
        onReload={onReload}
      />
      {contactsDrawerOpen && selectedClientId && (
        <ContactsDrawer
          handleClose={() => setContactsDrawerOpen(false)}
          tipo={ContactTypeEnum.CLIENTE}
          referenceId={selectedClientId}
          title={selectedTitle}
          readOnly={true}
        />
      )}
    </>
  );
};

export default TrackingsTable;

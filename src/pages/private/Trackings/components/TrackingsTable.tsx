import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { IconButton, Button, Box, Chip } from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { ESTADOS_SEGUIMIENTO, ESTADO_SEGUIMIENTO_COLORS, EstadoSeguimientoType } from '@/utils/constants';

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
  montoVenta: string;
  cue: string;
  departamentoEntrega?: string;
  estadoRolSeguimiento: EstadoSeguimientoType;
}

const defaultText = 'N/A';
export const TrackingsTable = ({ data, loading, onRowClick, onReload }: TrackingsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (sale: SaleProps) => {
    if (onRowClick) {
      onRowClick(sale);
    } else {
      navigate(`/tracking/${sale.id}`);
    }
  };

  const getStatusBackgroundColor = (status: string | null | undefined) => {
    if (!status || typeof status !== 'string') {
      return ESTADO_SEGUIMIENTO_COLORS.PENDIENTE;
    }
    const normalizedStatus = status.toUpperCase() as keyof typeof ESTADO_SEGUIMIENTO_COLORS;
    return ESTADO_SEGUIMIENTO_COLORS[normalizedStatus] || ESTADO_SEGUIMIENTO_COLORS.PENDIENTE;
  };

  const formattedData: Array<TrackingsDataTable> = data.map((item) => {
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
      montoVenta: formatCurrency(parseInt(item?.montoVenta ?? '0', 10)),
      cue: item?.cliente?.codigoUnidadEjecutora ?? defaultText,
      departamentoEntrega: item?.departamentoEntrega ?? defaultText,
      estadoRolSeguimiento: (item?.estadoRolSeguimiento ?? 'PENDIENTE') as EstadoSeguimientoType,
    };
  });

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
      render: (value, record) => (
        <Button
          variant="contained"
          component={Link}
          to={`/tracking/${record.id}`}
          startIcon={<Visibility />}
          size="small"
          color="info"
          style={{ width: '100%' }}
        >
          {value}
        </Button>
      )
    },
    { title: 'RUC Cliente', dataIndex: 'clienteRuc', width: 150, filter: true, sort: true },
    { title: 'Nombre Cliente', dataIndex: 'clienteNombre', width: 150, filter: true, sort: true },
    { title: 'RUC Empresa', dataIndex: 'empresaRuc', width: 150, filter: true, sort: true },
    { title: 'Nombre Empresa', dataIndex: 'empresaNombre', width: 150, filter: true, sort: true },
    { title: 'Cargo Contacto', dataIndex: 'contactoCargo', width: 150, filter: true, sort: true },
    { title: 'Nombre Contacto', dataIndex: 'contactoNombre', width: 150, filter: true, sort: true },
    { title: 'Nombre Catálogo', dataIndex: 'catalogoNombre', width: 150, filter: true, sort: true },
    { title: 'Descripción Catálogo', dataIndex: 'catalogoDescripcion', width: 150, filter: true, sort: true },
    { title: 'Fecha Emisión', dataIndex: 'fechaEmision', width: 150, filter: true, sort: true },
    { title: 'Fecha Máxima Entrega', dataIndex: 'fechaMaxForm', width: 150, filter: true, sort: true },
    {
      title: 'Fuera de plazo',
      dataIndex: 'fuera_plazo',
      width: 140,
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
    { title: 'Monto Venta', dataIndex: 'montoVenta', width: 150, filter: true, sort: true },
    { title: 'CUE', dataIndex: 'cue', width: 150, filter: true, sort: true },
    {
      title: 'Departamento Entrega',
      dataIndex: 'departamentoEntrega',
      width: 150,
    },
    {
      title: 'OCE',
      dataIndex: 'id',
      width: 100,
      render: (_, record) =>
        record.rawdata?.documentoOce ? (
          <IconButton color="error" component="a" href={record.rawdata?.documentoOce} target="_blank">
            <PictureAsPdf />
          </IconButton>
        ) : (
          defaultText
        ),
    },
    {
      title: 'OCF',
      dataIndex: 'id',
      width: 100,
      render: (_, record) =>
        record.rawdata?.documentoOcf ? (
          <IconButton color="error" component="a" href={record.rawdata?.documentoOcf} target="_blank">
            <PictureAsPdf />
          </IconButton>
        ) : (
          defaultText
        ),
    },
    {
      title: 'Carta Ampliación',
      dataIndex: 'id',
      width: 100,
      render: (_, record) =>
        record.rawdata?.cartaAmpliacion ? (
          <IconButton color="error" component="a" href={record.rawdata?.cartaAmpliacion} target="_blank">
            <PictureAsPdf />
          </IconButton>
        ) : (
          defaultText
        ),
    },
    {
      title: 'Estado Seguimiento',
      dataIndex: 'estadoRolSeguimiento',
      width: 150,
      sort: true,
      filter: true,
      render: (value: EstadoSeguimientoType | null | undefined) => {
        const estado = value && ESTADOS_SEGUIMIENTO[value] ? ESTADOS_SEGUIMIENTO[value] : ESTADOS_SEGUIMIENTO.PENDIENTE;
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

export default TrackingsTable;

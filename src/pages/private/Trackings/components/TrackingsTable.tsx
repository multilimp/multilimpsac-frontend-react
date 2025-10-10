import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { IconButton, Button, Box, Chip } from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { useNavigate, Link } from 'react-router-dom';
import { ESTADOS, EstadoVentaType, ESTADO_ROL_COLORS } from '@/utils/constants';

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
  estadoRolSeguimiento: EstadoVentaType;
}

const defaultText = 'N/A';
const TrackingsTable = ({ data, loading, onRowClick, onReload }: TrackingsTableProps) => {
  const { setSelectedSale } = useGlobalInformation();
  const navigate = useNavigate();

  const handleRowClick = (sale: SaleProps) => {
    if (onRowClick) {
      onRowClick(sale);
    } else {
      setSelectedSale(sale);
      navigate(`/tracking/${sale.id}`);
    }
  };

  const getStatusBackgroundColor = (status: string | null | undefined) => {
    if (!status || typeof status !== 'string') {
      return ESTADO_ROL_COLORS.PENDIENTE;
    }
    const normalizedStatus = status.toUpperCase() as keyof typeof ESTADO_ROL_COLORS;
    return ESTADO_ROL_COLORS[normalizedStatus] || ESTADO_ROL_COLORS.PENDIENTE;
  };

  const formattedData: Array<TrackingsDataTable> = data.map((item) => {
    return {
      id: item.id,
      rawdata: item,
      codigoVenta: item.codigoVenta,
      clienteRuc: item?.cliente.ruc ?? defaultText,
      clienteNombre: item?.cliente.razonSocial ?? defaultText,
      empresaRuc: item?.empresa.ruc ?? defaultText,
      empresaNombre: item?.empresa.razonSocial ?? defaultText,
      contactoCargo: item?.contactoCliente?.cargo ?? defaultText,
      contactoNombre: item?.contactoCliente?.nombre ?? defaultText,
      catalogoNombre: item?.catalogoEmpresa?.nombre ?? defaultText,
      catalogoDescripcion: item?.catalogoEmpresa?.descripcion ?? defaultText,
      fechaEmision: formattedDate(item.fechaEmision, undefined, defaultText),
      fechaMaxForm: formattedDate(item.fechaMaxForm, undefined, defaultText),
      montoVenta: formatCurrency(parseInt(item.montoVenta, 10)),
      cue: item.cliente?.codigoUnidadEjecutora ?? defaultText,
      departamentoEntrega: item.departamentoEntrega ?? defaultText,
      estadoRolSeguimiento: item.estadoRolSeguimiento || 'PENDIENTE',
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
          to={`/tracking/${record.rawdata.id}`}
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
      title: 'Estado Seguimiento',
      dataIndex: 'estadoRolSeguimiento',
      width: 150,
      sort: true,
      filter: true,
      render: (value: EstadoVentaType | null | undefined) => {
        const estado = value && ESTADOS[value] ? ESTADOS[value] : ESTADOS.PENDIENTE;
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

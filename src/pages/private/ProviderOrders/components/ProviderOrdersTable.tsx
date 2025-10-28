import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { IconButton, Button, Typography } from '@mui/material';
import { PictureAsPdf, Visibility } from '@mui/icons-material';
import { calcularUtilidadCompleta } from '@/utils/utilidadCalculator';

interface ProviderOrdersTableProps {
  data: Array<SaleProps>;
  loading: boolean;
  onRowClick: (sale: SaleProps) => void;
}

interface ProviderOrdersDataTable {
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
}

const defaultText = ' ';
const ProviderOrdersTable = ({ data, loading, onRowClick }: ProviderOrdersTableProps) => {
  const formattedData: Array<ProviderOrdersDataTable> = data.map((item) => ({
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
    codigoOcf: item.codigoOcf ?? defaultText,
    montoVenta: formatCurrency(parseInt(item.montoVenta, 10)),
    cue: item.cliente?.codigoUnidadEjecutora ?? defaultText,
    departamentoEntrega: item.departamentoEntrega ?? defaultText,
  }));

  const columns: Array<AntColumnType<ProviderOrdersDataTable>> = [
    {
      title: 'Código OC',
      dataIndex: 'codigoVenta',
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
      title: 'Código OCF',
      dataIndex: 'codigoOcf',
      width: 200,
      filter: true,
      sort: true,
    },
    {
      title: 'Utilidad %',
      dataIndex: 'utilidad',
      filter: false,
      width: 180,
      align: 'center',
      render: (_: unknown, record: ProviderOrdersDataTable) => {
        if (!record?.rawdata) {
          return (
            <Typography
              variant="body2"
              sx={{
                color: '#374151',
                bgcolor: '#e5e7eb',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                display: 'inline-block',
                fontWeight: 'medium',
                fontSize: '0.875rem',
              }}
            >
              -
            </Typography>
          );
        }

        const montoVenta = record.rawdata.montoVenta;
        const totalProveedores = record.rawdata.ordenesProveedor?.reduce((sum, op) => {
          const total = typeof op.totalProveedor === 'string'
            ? parseFloat(op.totalProveedor)
            : (op.totalProveedor || 0);
          return sum + total;
        }, 0) || 0;

        const utilidad = calcularUtilidadCompleta(montoVenta, totalProveedores);

        const isSuccess = utilidad.color === 'success';
        const isError = utilidad.color === 'error';
        const bgColor = isSuccess ? '#dcfce7' : isError ? '#fee2e2' : '#e5e7eb';
        const textColor = isSuccess ? '#166534' : isError ? '#991b1b' : '#374151';

        return (
          <Typography
            variant="body2"
            sx={{
              color: textColor,
              bgcolor: bgColor,
              borderRadius: 1,
              px: 1,
              py: 0.5,
              display: 'inline-block',
              fontWeight: 'bold',
              fontSize: '0.875rem',
            }}
          >
            {`${utilidad.mensaje}${utilidad.porcentaje ? ` (${utilidad.porcentaje.toFixed(2)}%)` : ''}`}
          </Typography>
        );
      },
    }
  ];

  return (
    <AntTable
      columns={columns}
      data={formattedData}
      loading={loading}
    />
  );
};

export default ProviderOrdersTable;

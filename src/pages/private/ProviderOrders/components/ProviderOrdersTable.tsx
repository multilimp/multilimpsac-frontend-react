import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { IconButton } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

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
}

const defaultText = 'N/A';
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
    montoVenta: formatCurrency(parseInt(item.montoVenta, 10)),
    cue: item.cliente?.codigoUnidadEjecutora ?? defaultText,
  }));

  const columns: Array<AntColumnType<ProviderOrdersDataTable>> = [
    { title: 'Código Venta', dataIndex: 'codigoVenta', width: 150, filter: true, sort: true },
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
      title: 'Dirección',
      dataIndex: 'id',
      width: 300,
      render: (_, record) => {
        return (
          <>
            {record.rawdata?.direccionEntrega} - {record.rawdata?.referenciaEntrega}
            <br />
            {record.rawdata?.departamentoEntrega?.name ?? defaultText} -{record.rawdata?.provinciaEntrega?.name ?? defaultText} -
            {record.rawdata?.distritoEntrega?.name ?? defaultText}
          </>
        );
      },
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
  ];

  return (
    <AntTable
      columns={columns}
      data={formattedData}
      loading={loading}
      onRow={(record) => {
        return {
          onClick: () => onRowClick(record.rawdata),
          style: {
            cursor: 'pointer',
          },
        };
      }}
    />
  );
};

export default ProviderOrdersTable;

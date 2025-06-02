import { Fragment } from 'react';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { SaleProps } from '@/services/sales/sales';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/functions';
import { Fab } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

interface ProviderOrdersTableProps {
  data: Array<SaleProps>;
  loading: boolean;
  onRowClick: (sale: SaleProps) => void;
}

const ProviderOrdersTable = ({ data, loading, onRowClick }: ProviderOrdersTableProps) => {
  const columns: Array<AntColumnType<SaleProps>> = [
    { title: 'Código Venta', dataIndex: 'codigoVenta', minWidth: 125 },    {
      title: 'Cliente',
      align: 'center',
      children: [
        { title: 'RUC', dataIndex: 'clienteId', minWidth: 100, render: (_, record) => record.cliente?.ruc ?? 'N/A' },
        { title: 'Razón social', dataIndex: 'clienteId', minWidth: 250, render: (_, record) => record.cliente?.razonSocial ?? 'N/A' },
      ],
    },    {
      title: 'Empresa',
      align: 'center',
      children: [
        { title: 'RUC', dataIndex: 'empresaId', minWidth: 100, render: (_, record) => record.empresa?.ruc ?? 'N/A' },
        { title: 'Razón social', dataIndex: 'empresaId', minWidth: 250, render: (_, record) => record.empresa?.razonSocial ?? 'N/A' },
      ],
    },    
    {
      title: 'Contacto',
      align: 'center',
      children: [
        { title: 'Cargo', dataIndex: 'contactoClienteId', minWidth: 200, render: (_, record) => record.contactoCliente?.cargo ?? 'N/A' },
        { title: 'Nombre', dataIndex: 'contactoClienteId', minWidth: 250, render: (_, record) => record.contactoCliente?.nombre ?? 'N/A' },
      ],
    },    {
      title: 'Catálogo',
      dataIndex: 'catalogoEmpresaId',
      minWidth: 300,
      render: (_, record) => (
        <Fragment>
          {record.catalogoEmpresa?.nombre ?? 'N/A'}
          <br />
          {record.catalogoEmpresa?.descripcion ?? 'N/A'}
        </Fragment>
      ),
    },
    { title: 'Fecha emisión', dataIndex: 'fechaEmision', minWidth: 150, render: (value) => dayjs(value).format('DD/MM/YYYY') },
    { title: 'Fecha máxima entrega', dataIndex: 'fechaMaxForm', minWidth: 200, render: (value) => dayjs(value).format('DD/MM/YYYY') },
    { title: 'Monto Venta', dataIndex: 'montoVenta', minWidth: 200, render: (value) => formatCurrency(value) },
    { title: 'CUE', dataIndex: 'id', minWidth: 200, render: () => 'QUE ES CUE?' },
    {
      title: 'Dirección',
      align: 'center',
      children: [        { title: 'Departamento', dataIndex: 'departamentoEntrega', minWidth: 150, render: (_, record) => record.departamentoEntrega?.name ?? 'N/A' },
        { title: 'Provincia', dataIndex: 'provinciaEntrega', minWidth: 150, render: (_, record) => record.provinciaEntrega?.name ?? 'N/A' },
        { title: 'Distrito', dataIndex: 'distritoEntrega', minWidth: 150, render: (_, record) => record.distritoEntrega?.name ?? 'N/A' },
        { title: 'Dirección', dataIndex: 'direccionEntrega', minWidth: 200 },
        { title: 'Referencia', dataIndex: 'referenciaEntrega', minWidth: 200 },
      ],
    },
    {
      title: 'OCE',
      dataIndex: 'documentoOce',
      minWidth: 75,
      align: 'center',
      render: (_, record) => (
        <Fab size="small" color="error" component="a" href={record.documentoOce} target="_blank">
          <PictureAsPdf />
        </Fab>
      ),
    },
    {
      title: 'OCF',
      dataIndex: 'documentoOcf',
      minWidth: 75,
      align: 'center',
      render: (_, record) => (
        <Fab size="small" color="error" component="a" href={record.documentoOcf} target="_blank">
          <PictureAsPdf />
        </Fab>
      ),
    },
  ];

  return (
    <AntTable
      columns={columns}
      data={data}
      loading={loading}
      onRow={(record) => {
        return {
          onClick: () => onRowClick(record),
          style: {
            cursor: 'pointer',
          },
        };
      }}
    />
  );
};

export default ProviderOrdersTable;

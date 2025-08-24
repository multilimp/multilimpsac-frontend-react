import AntTable, { AntColumnType } from '@/components/AntTable';
import { CotizacionProps, CotizacionEstado } from '@/types/cotizacion.types';
import { Tag, Button } from 'antd';
import { Box } from '@mui/material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { Link } from 'react-router-dom';

interface QuotesTableProps {
  data: CotizacionProps[];
  loading: boolean;
  onReload?: () => void | Promise<void>;
}

const QuotesTable = ({ data, loading, onReload }: QuotesTableProps) => {
  const getEstadoColor = (estado: CotizacionEstado) => {
    switch (estado) {
      case CotizacionEstado.PENDIENTE:
        return 'orange';
      case CotizacionEstado.APROBADO:
        return 'green';
      case CotizacionEstado.COTIZADO:
        return 'blue';
      default:
        return 'default';
    }
  };

  const getEstadoLabel = (estado: CotizacionEstado) => {
    switch (estado) {
      case CotizacionEstado.PENDIENTE:
        return 'Pendiente';
      case CotizacionEstado.APROBADO:
        return 'Aprobado';
      case CotizacionEstado.COTIZADO:
        return 'Cotizado';
      default:
        return estado;
    }
  };

  const columns: AntColumnType<CotizacionProps>[] = [
    {
      title: 'Cotización',
      dataIndex: 'codigoCotizacion',
      width: 100,
      filter: true,
      sort: true,
      render: (value, record) => (
        <Link to={`/quotes/${record.id}/edit`}>
          <Button
            type="link"
            style={{
              padding: 2,
              backgroundColor: '#1976d2',
              width: '100%',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center'
            }}
          >
            {value}
          </Button>
        </Link>
      )
    },
    {
      title: 'Cliente',
      dataIndex: ['cliente', 'razonSocial'],
      width: 200,
      filter: true,
      sort: true,
      render: (_, record) => (
        <div>
          <div><strong>{record.cliente?.razonSocial || 'N/A'}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            RUC: {record.cliente?.ruc || 'N/A'}
          </div>
        </div>
      )
    },
    {
      title: 'Empresa',
      dataIndex: ['empresa', 'razonSocial'],
      width: 150,
      filter: true,
      sort: true,
      render: (_, record) => record.empresa?.razonSocial || 'N/A'
    },
    {
      title: 'Departamento',
      dataIndex: 'departamento',
      width: 120,
      filter: true,
      sort: true,
      render: (_, record) => (
        <span>
          {record.departamentoEntrega || 'N/A'}
        </span>
      )
    },
    {
      title: 'Monto Total',
      dataIndex: 'montoTotal',
      width: 120,
      sort: true,
      filter: true,
      render: (value) => (
        <strong style={{ color: '#1976d2' }}>
          {formatCurrency(parseFloat(value || '0'))}
        </strong>
      )
    },
    {
      title: 'Fecha Cotización',
      dataIndex: 'fechaCotizacion',
      width: 120,
      sort: true,
      filter: true,
      render: (value) => formattedDate(value)
    },
    {
      title: 'Fecha Entrega',
      dataIndex: 'fechaEntrega',
      width: 120,
      sort: true,
      filter: true,
      render: (value) => value ? formattedDate(value) : '-'
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 100,
      filter: true,
      sort: true,
      filters: [
        { text: 'Pendiente', value: CotizacionEstado.PENDIENTE },
        { text: 'Aprobado', value: CotizacionEstado.APROBADO },
        { text: 'Cotizado', value: CotizacionEstado.COTIZADO },
      ],
      onFilter: (value, record) => record.estado === value,
      render: (estado: CotizacionEstado) => (
        <Tag color={getEstadoColor(estado)}>
          {getEstadoLabel(estado)}
        </Tag>
      )
    },
  ];

  return (
    <Box position="relative">
      <AntTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey="id"
        onReload={onReload}
      />
    </Box>
  );
};

export default QuotesTable;

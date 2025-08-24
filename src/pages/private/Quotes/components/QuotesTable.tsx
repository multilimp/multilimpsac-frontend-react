import AntTable, { AntColumnType } from '@/components/AntTable';
import { CotizacionProps, CotizacionEstado } from '@/types/cotizacion.types';
import { Button, Space, Tag, Tooltip } from 'antd';
import { Edit, Visibility, Delete, ContentCopy } from '@mui/icons-material';
import { Box } from '@mui/material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { Link } from 'react-router-dom';

interface QuotesTableProps {
  data: CotizacionProps[];
  loading: boolean;
}

const QuotesTable = ({ data, loading }: QuotesTableProps) => {
  const getEstadoColor = (estado: CotizacionEstado) => {
    switch (estado) {
      case CotizacionEstado.PENDIENTE:
        return 'orange';
      case CotizacionEstado.ACEPTADA:
        return 'green';
      case CotizacionEstado.RECHAZADA:
        return 'red';
      default:
        return 'default';
    }
  };

  const getEstadoLabel = (estado: CotizacionEstado) => {
    switch (estado) {
      case CotizacionEstado.PENDIENTE:
        return 'Pendiente';
      case CotizacionEstado.ACEPTADA:
        return 'Aceptada';
      case CotizacionEstado.RECHAZADA:
        return 'Rechazada';
      default:
        return estado;
    }
  };

  const columns: AntColumnType<CotizacionProps>[] = [
    { 
      title: 'Código', 
      dataIndex: 'codigoCotizacion', 
      width: 150,
      filter: true,
      sort: true,
      render: (value) => (
        <Box fontWeight="bold" color="primary.main">
          {value}
        </Box>
      )
    },
    { 
      title: 'Cliente', 
      width: 200,
      filter: true,
      sort: true,
      render: (record) => (
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
      width: 150,
      filter: true,
      sort: true,
      render: (record) => record.empresa?.razonSocial || 'N/A'
    },
    { 
      title: 'Monto Total', 
      dataIndex: 'montoTotal',
      width: 120,
      sort: true,
      render: (value) => (
        <strong style={{ color: '#1976d2' }}>
          {formatCurrency(parseFloat(value || '0'))}
        </strong>
      )
    },
    { 
      title: 'Tipo Pago', 
      dataIndex: 'tipoPago',
      width: 100,
      filter: true,
      render: (value) => (
        <Tag color={value === 'CONTADO' ? 'green' : value === 'CREDITO' ? 'blue' : 'purple'}>
          {value}
        </Tag>
      )
    },
    { 
      title: 'Estado', 
      dataIndex: 'estado',
      width: 100,
      filter: true,
      render: (estado: CotizacionEstado) => (
        <Tag color={getEstadoColor(estado)}>
          {getEstadoLabel(estado)}
        </Tag>
      )
    },
    { 
      title: 'Fecha Cotización', 
      dataIndex: 'fechaCotizacion',
      width: 120,
      sort: true,
      render: (value) => formattedDate(value)
    },
    { 
      title: 'Fecha Entrega', 
      dataIndex: 'fechaEntrega',
      width: 120,
      sort: true,
      render: (value) => value ? formattedDate(value) : '-'
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button 
              size="small" 
              icon={<Visibility />} 
              onClick={() => console.log('Ver', record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button 
              size="small" 
              type="primary" 
              icon={<Edit />} 
              component={Link}
              to={`/quotes/${record.id}/edit`}
            />
          </Tooltip>
          <Tooltip title="Duplicar">
            <Button 
              size="small" 
              icon={<ContentCopy />} 
              onClick={() => console.log('Duplicar', record)}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button 
              size="small" 
              danger 
              icon={<Delete />} 
              onClick={() => console.log('Eliminar', record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Box position="relative">
      <AntTable
        columns={columns}
        data={data}
        loading={loading}
        rowKey="id"
      />
    </Box>
  );
};

export default QuotesTable;

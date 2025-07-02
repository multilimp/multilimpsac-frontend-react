
import AntTable from '@/components/AntTable';
import { CotizacionProps } from '@/types/cotizacion.types';
import { TableColumnsType } from 'antd';
import { Button, Space } from 'antd';
import { Edit } from '@mui/icons-material';
import { Box } from '@mui/material';
import { formatCurrency } from '@/utils/functions';

interface QuotesTableProps {
  data: CotizacionProps[];
  loading: boolean;
  onEdit: (quote: CotizacionProps) => void;
}

const QuotesTable = ({ data, loading, onEdit }: QuotesTableProps) => {
  const columns: TableColumnsType<CotizacionProps> = [
    { title: 'Código', dataIndex: 'codigoCotizacion', sorter: (a, b) => a.codigoCotizacion.localeCompare(b.codigoCotizacion) },
    { title: 'RUC Cliente', render: (record) => record.cliente?.ruc || 'N/A' },
    { title: 'Razón Social', render: (record) => record.cliente?.razonSocial || 'N/A' },
    { title: 'Departamento', dataIndex: 'departamentoEntrega' },
    { 
      title: 'Monto', 
      dataIndex: 'montoTotal',
      sorter: (a, b) => parseFloat(a.montoTotal) - parseFloat(b.montoTotal),
      render: v => <strong>{formatCurrency(parseFloat(v || '0'))}</strong>
    },
    { title: 'Plaza de Entrega', dataIndex: 'distritoEntrega' },
    { title: 'Fecha', dataIndex: 'fechaCotizacion', sorter: (a, b) => new Date(a.fechaCotizacion).getTime() - new Date(b.fechaCotizacion).getTime() },
    { title: 'Estado', dataIndex: 'estado' },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<Edit />} onClick={() => onEdit(record)}>
            Editar
          </Button>
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

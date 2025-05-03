import AntTable from '@/components/AntTable';
import { TrackingProps } from '@/services/trackings/trackings.d';
import { TableColumnsType, Tag } from 'antd';
import dayjs from 'dayjs';

const statusColorMap: Record<TrackingProps['status'], string> = {
  pending: 'orange',
  in_progress: 'blue',
  delivered: 'green',
  canceled: 'red'
};

const TrackingsTable = ({ data = [], loading }: { data?: TrackingProps[]; loading: boolean }) => {
  const columns: TableColumnsType<TrackingProps> = [
    { title: 'ID', dataIndex: 'id', width: 70, fixed: 'left' },
    { title: 'ID Venta', dataIndex: 'saleId', width: 100 },
    { title: 'RUC Cliente', dataIndex: 'clientRuc', width: 120 },
    { title: 'RUC Empresa', dataIndex: 'companyRuc', width: 120 },
    { title: 'Razón Social Empresa', dataIndex: 'companyBusinessName', width: 200 },
    { title: 'Cliente', dataIndex: 'clientName', width: 150 },
    { 
      title: 'Fecha Máx. Entrega', 
      dataIndex: 'maxDeliveryDate', 
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      width: 140 
    },
    { 
      title: 'Monto Venta', 
      dataIndex: 'saleAmount', 
      render: (amount: number) => `S/ ${amount.toFixed(2)}`,
      width: 120,
      align: 'right'
    },
    { title: 'CUE', dataIndex: 'cue', width: 100 },
    { title: 'Departamento', dataIndex: 'department', width: 140 },
    { title: 'OCE', dataIndex: 'oce', width: 100 },
    { title: 'OCF', dataIndex: 'ocf', width: 100 },
    { 
      title: 'Perú Compras', 
      dataIndex: 'peruPurchases', 
      render: (value: boolean) => value ? 'Sí' : 'No',
      width: 120
    },
    { title: 'GRR', dataIndex: 'grr', width: 100 },
    { title: 'Factura', dataIndex: 'invoiceNumber', width: 100, render: (text?: string) => text || '-' },
    { 
      title: 'Refact', 
      dataIndex: 'isRefact', 
      render: (value: boolean) => value ? 'Sí' : 'No',
      width: 90
    },
    { 
      title: 'Fecha Perú Compras', 
      dataIndex: 'peruPurchasesDate', 
      render: (date?: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
      width: 160
    },
    { 
      title: 'Fecha Entrega OC', 
      dataIndex: 'deliveryDateOC', 
      render: (date?: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
      width: 150
    },
    { 
      title: 'Utilidad', 
      dataIndex: 'utility', 
      render: (value: number) => `${value}%`,
      width: 100,
      align: 'right'
    },
    { 
      title: 'Estado', 
      dataIndex: 'status', 
      render: (status: TrackingProps['status']) => (
        <Tag color={statusColorMap[status]}>
          {status === 'in_progress' ? 'En Progreso' : 
           status === 'pending' ? 'Pendiente' :
           status === 'delivered' ? 'Entregado' : 'Cancelado'}
        </Tag>
      ),
      width: 120,
      fixed: 'right'
    }
  ];

  return (
    <AntTable 
      columns={columns} 
      data={data} 
      loading={loading} 
      rowKey="id" 
      scroll={{ x: 3000 }} 
    />
  );
};

export default TrackingsTable;
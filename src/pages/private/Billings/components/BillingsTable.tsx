import AntTable from '@/components/AntTable';
import { BillingProps } from '@/services/billings/billings.d';
import { TableColumnsType } from 'antd';
import dayjs from 'dayjs';

interface BillingsTableProps {
  data?: Array<BillingProps>;
  loading: boolean;
}

const statusMap: Record<NonNullable<BillingProps['status']>, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  canceled: 'Cancelado',
  processing: 'Procesando'
};

const BillingsTable = ({ data = [], loading }: BillingsTableProps) => {
  const columns: TableColumnsType<BillingProps> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'ID Venta', dataIndex: 'saleId', width: 100 },
    { title: 'Razón Social Cliente', dataIndex: 'clientBusinessName', width: 200 },
    { title: 'RUC Cliente', dataIndex: 'clientRuc', width: 120 },
    { title: 'RUC Empresa', dataIndex: 'companyRuc', width: 120 },
    { title: 'Razón Social Empresa', dataIndex: 'companyBusinessName', width: 200 },
    { title: 'Contacto', dataIndex: 'contact', width: 150 },
    { 
      title: 'Fecha Registro', 
      dataIndex: 'registerDate', 
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      width: 120
    },
    { 
      title: 'Monto Venta', 
      dataIndex: 'saleAmount', 
      render: (amount: number) => `S/ ${amount.toFixed(2)}`,
      width: 120 
    },
    { title: 'OCE', dataIndex: 'oce', width: 100 },
    { title: 'OCF', dataIndex: 'ocf', width: 100 },
    { 
      title: 'Factura', 
      dataIndex: 'invoiceNumber',
      render: (invoice: string | undefined) => invoice || '-',
      width: 100 
    },
    { 
      title: 'Estado', 
      dataIndex: 'status',
      render: (status: BillingProps['status']) => (
        status ? statusMap[status] : 'Desconocido'
      ),
      width: 120
    }
  ];

  return <AntTable columns={columns} data={data} loading={loading} rowKey="id" scroll={{ x: 2000 }} />;
};

export default BillingsTable;
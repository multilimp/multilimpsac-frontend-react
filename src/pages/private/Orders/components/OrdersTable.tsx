// src/pages/Orders/components/OrdersTable.tsx
import AntTable, { AntColumnType } from '@/components/AntTable';
import { OrderProps } from '@/services/orders/orders';
import { Button, ButtonGroup } from '@mui/material';
import { Edit } from '@mui/icons-material';

interface OrdersTableProps {
  data: OrderProps[];
  loading: boolean;
  onEdit: (order: OrderProps) => void;
}

const OrdersTable = ({ data, loading, onEdit }: OrdersTableProps) => {
  const columns: AntColumnType<OrderProps>[] = [
    {
      title: 'Acciones',
      dataIndex: 'id',
      render: (_: any, record: OrderProps) => (
        <ButtonGroup size="small">
          <Button color="info" onClick={() => onEdit(record)}>
            <Edit />
          </Button>
        </ButtonGroup>
      ),
    },
    { title: 'Código Vento', dataIndex: 'codigoVento', minWidth: 120, filter: true },
    { title: 'Razón social cliente', dataIndex: 'razonSocialCliente', minWidth: 180, filter: true },
    { title: 'RUC cliente', dataIndex: 'rucCliente', minWidth: 110, filter: true },
    { title: 'RUC empresa', dataIndex: 'rucEmpresa', minWidth: 110, filter: true },
    { title: 'Razón social empresa', dataIndex: 'razonSocialEmpresa', minWidth: 180, filter: true },
    { title: 'Contacto', dataIndex: 'contacto', minWidth: 120, filter: true },
    { title: 'Catálogo', dataIndex: 'catalogo', minWidth: 120 },
    { title: 'Fecha registro', dataIndex: 'fechaRegistro', minWidth: 110 },
    { title: 'Fecha máxima entrega', dataIndex: 'fechaMaximaEntrega', minWidth: 130 },
    { title: 'Monto Venta', dataIndex: 'montoVenta', minWidth: 110 },
    { title: 'CUE', dataIndex: 'cue', minWidth: 90 },
    { title: 'Departamento', dataIndex: 'departamento', minWidth: 120 },
    { title: 'OCE', dataIndex: 'oce', minWidth: 90 },
    { title: 'OCF', dataIndex: 'ocf', minWidth: 90 },
    { title: 'Fecha entrega OC', dataIndex: 'fechaEntregaOC', minWidth: 130 },
  ];

  return (
    <AntTable
      columns={columns}
      data={data}
      loading={loading}
      rowKey="id"
    />
  );
};

export default OrdersTable;
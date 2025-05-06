import AntTable, { AntColumnType } from '@/components/AntTable';
import { ClientProps } from '@/services/clients/clients';
import { FormHelperText, Typography } from '@mui/material';

interface ClientsTableProps {
  data: ClientProps[];
  loading: boolean;
}

const ClientsTable = ({ data, loading }: ClientsTableProps) => {
  const columns: Array<AntColumnType<ClientProps>> = [
    { title: 'RUC', dataIndex: 'ruc', minWidth: 110 },
    { title: 'Razón Social', dataIndex: 'razonSocial', minWidth: 200 },
    { title: 'Código Unidad', dataIndex: 'codigoUnidadEjecutora', minWidth: 150, render: (text) => text ?? '-' },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      minWidth: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>{[record.departamento?.name, record.provincia?.name, record.distrito?.name].filter(Boolean).join(' - ')}</FormHelperText>
        </>
      ),
    },
    { title: 'Acciones', dataIndex: 'id' },
  ];

  return <AntTable data={data} columns={columns} loading={loading} />;
};

export default ClientsTable;

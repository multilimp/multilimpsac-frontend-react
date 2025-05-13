import AntTable, { AntColumnType } from '@/components/AntTable';
import { ClientProps } from '@/services/clients/clients';
import { ModalStateEnum } from '@/types/global.enum';
import { Delete, Edit } from '@mui/icons-material';
import { Button, ButtonGroup, FormHelperText, Typography } from '@mui/material';

interface ClientsTableProps {
  data: ClientProps[];
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: ClientProps) => void;
}

const ClientsTable = ({ data, loading, onRecordAction }: ClientsTableProps) => {
  const columns: Array<AntColumnType<ClientProps>> = [
    { title: 'RUC', dataIndex: 'ruc', width: 110, filter: true },
    { title: 'Razón Social', dataIndex: 'razonSocial', width: 200 },
    { title: 'Código Unidad', dataIndex: 'codigoUnidadEjecutora', width: 150, render: (text) => text ?? '-' },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      width: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>{[record.departamento?.name, record.provincia?.name, record.distrito?.name].filter(Boolean).join(' - ')}</FormHelperText>
        </>
      ),
    },
    {
      title: 'Acciones',
      dataIndex: 'id',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <ButtonGroup size="small">
          <Button color="info" onClick={() => onRecordAction(ModalStateEnum.BOX, record)}>
            <Edit />
          </Button>
          <Button color="error" onClick={() => onRecordAction(ModalStateEnum.DELETE, record)}>
            <Delete />
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return <AntTable data={data} columns={columns} loading={loading} />;
};

export default ClientsTable;

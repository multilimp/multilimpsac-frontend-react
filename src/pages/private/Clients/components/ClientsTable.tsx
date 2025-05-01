import { Delete, Edit, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Button, ButtonGroup, FormHelperText, Typography } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ClientProps } from '@/services/clients/client';

interface ClientsTableProps {
  data: Array<ClientProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: ClientProps) => void;
}

const ClientsTable = ({ data, loading, onRecordAction }: ClientsTableProps) => {
  const columns: Array<AntColumnType<ClientProps>> = [
    {
      title: 'Acciones',
      dataIndex: 'id',
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
    { title: 'Razón social', dataIndex: 'razon_social', minWidth: 150, filter: true },
    { title: 'RUC', dataIndex: 'ruc', minWidth: 100, filter: true },
    { title: 'Código unidad', dataIndex: 'cod_unidad', minWidth: 100, filter: true },
    {
      title: 'Dirección',
      dataIndex: 'departamento',
      minWidth: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>
            {record.departamento} - {record.provincia} - {record.distrito}
          </FormHelperText>
        </>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      render: (value) => (value ? <RadioButtonChecked color="success" /> : <RadioButtonUnchecked color="error" />),
    },
  ];

  return <AntTable columns={columns} data={data} loading={loading} />;
};

export default ClientsTable;

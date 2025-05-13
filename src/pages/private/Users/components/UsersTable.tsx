import { Delete, Edit } from '@mui/icons-material';
import { UserProps } from '@/services/users/users';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Avatar, Button, ButtonGroup } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';

interface UsersTableProps {
  data: UserProps[];
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: UserProps) => void;
}

const UsersTable = ({ data, loading, onRecordAction }: UsersTableProps) => {
  const columns: AntColumnType<UserProps>[] = [
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
    {
      title: 'Foto',
      dataIndex: 'foto',
      minWidth: 75,
      render: (value, record) => <Avatar src={value} alt={record.nombre} />,
    },
    { title: 'Nombre', dataIndex: 'nombre', minWidth: 150, filter: true },
    { title: 'Email', dataIndex: 'email', minWidth: 200, filter: true },
    { title: 'Rol', dataIndex: 'role', minWidth: 100, filter: true },
    {
      title: 'Estado',
      dataIndex: 'estado',
      minWidth: 100,
      render: (value) => (value ? 'Activo' : 'Inactivo'),
    },
  ];

  return <AntTable columns={columns} data={data} loading={loading} />;
};

export default UsersTable;

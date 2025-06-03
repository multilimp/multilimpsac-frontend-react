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
      title: 'Foto',
      dataIndex: 'foto',
      width: 75,
      render: (value, record) => <Avatar src={value} alt={record.nombre} />,
    },
    { title: 'Nombre', dataIndex: 'nombre', width: 200, filter: true, sort: true },
    { title: 'Email', dataIndex: 'email', width: 200, filter: true, sort: true },
    { title: 'Rol', dataIndex: 'role', width: 100, filter: true, sort: true },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 100,
      render: (value) => (value ? 'Activo' : 'Inactivo'),
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

  return <AntTable columns={columns} data={data} loading={loading} />;
};

export default UsersTable;

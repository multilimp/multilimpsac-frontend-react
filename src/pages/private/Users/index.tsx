// src/pages/Users/index.tsx
import PageContent from '@/components/PageContent';
import UsersTable from './components/UsersTable';
import UsersModal from './components/Users.Modal';
import ChangePasswordModal from './components/ChangePasswordModal';
import ConfirmDelete from '@/components/ConfirmDelete';
import { getUsers } from '@/services/users/users.request';
import { useEffect, useState } from 'react';
import { UserProps } from '@/services/users/users';
import { notification } from 'antd';
import { Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import { useAppContext } from '@/context';
import { RolesEnum } from '@/services/users/user.enum';

const Users = () => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserProps[]>([]);
  const [modal, setModal] = useState<ModalStateProps<UserProps>>(null);
  const [changePasswordUser, setChangePasswordUser] = useState<UserProps | null>(null);

  const isAdmin = user?.role === RolesEnum.ADMIN;

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setData([...res]);
    } catch (error) {
      notification.error({
        message: 'Error al cargar usuarios',
        description: `No se pudo obtener el listado de usuarios. ${String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <UsersTable
        data={data}
        loading={loading}
        onRecordAction={(mode, record) => setModal({ mode, data: record })}
        onChangePassword={(user) => setChangePasswordUser(user)}
      />

      {modal?.mode === ModalStateEnum.BOX ? (
        <UsersModal
          data={modal.data}
          handleReload={obtainData}
          handleClose={() => setModal(null)}
        />
      ) : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete
          endpoint={`/users/${modal.data?.id}`}
          handleClose={() => setModal(null)}
          handleReload={obtainData}
        />
      ) : null}

      {changePasswordUser && (
        <ChangePasswordModal
          user={changePasswordUser}
          handleClose={() => setChangePasswordUser(null)}
        />
      )}
    </PageContent>
  );
};

export default Users;

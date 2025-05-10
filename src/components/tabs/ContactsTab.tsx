
import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Table } from 'antd';
import { Add, Delete, Edit } from '@mui/icons-material';
import { ContactProps } from '@/services/contacts/contacts';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ContactsModal from '../modals/ContactsModal';
import ConfirmDelete from '@/components/ConfirmDelete';
import useContacts from '@/hooks/useContacts';

interface ContactsTabProps {
  entityType: 'cliente' | 'proveedor' | 'transporte';
  entityId: number;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ entityType, entityId }) => {
  const { contacts, loadingContacts, obtainContacts } = useContacts({ entityType, entityId });
  const [modal, setModal] = useState<ModalStateProps<ContactProps>>(null);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record: ContactProps) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            color="primary"
            startIcon={<Edit />}
            onClick={() => setModal({ mode: ModalStateEnum.BOX, data: record })}
          >
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={() => setModal({ mode: ModalStateEnum.DELETE, data: record })}
          >
            Eliminar
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Contactos</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          onClick={() => setModal({ mode: ModalStateEnum.BOX })}
        >
          Agregar Contacto
        </Button>
      </Stack>
      
      <Table 
        dataSource={contacts} 
        columns={columns} 
        loading={loadingContacts} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {modal?.mode === ModalStateEnum.BOX && (
        <ContactsModal
          data={modal.data}
          handleClose={() => setModal(null)}
          handleReload={obtainContacts}
          entityType={entityType}
          entityId={entityId}
        />
      )}

      {modal?.mode === ModalStateEnum.DELETE && (
        <ConfirmDelete
          endpoint={`/contacts/${modal.data?.id}`}
          handleClose={() => setModal(null)}
          handleReload={obtainContacts}
        />
      )}
    </Box>
  );
};

export default ContactsTab;

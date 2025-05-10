
import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Table } from 'antd';
import { Add, Delete, Edit } from '@mui/icons-material';
import { CatalogProps } from '@/services/catalogs/catalogs';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import CatalogsModal from '../modals/CatalogsModal';
import ConfirmDelete from '@/components/ConfirmDelete';
import useCatalogs from '@/hooks/useCatalogs';

interface CatalogsTabProps {
  companyId: number;
}

const CatalogsTab: React.FC<CatalogsTabProps> = ({ companyId }) => {
  const { catalogs, loadingCatalogs, obtainCatalogs } = useCatalogs(companyId);
  const [modal, setModal] = useState<ModalStateProps<CatalogProps>>(null);

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      ellipsis: true,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record: CatalogProps) => (
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
        <Typography variant="h6">Catálogos</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          onClick={() => setModal({ mode: ModalStateEnum.BOX })}
        >
          Agregar Catálogo
        </Button>
      </Stack>
      
      <Table 
        dataSource={catalogs} 
        columns={columns} 
        loading={loadingCatalogs} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {modal?.mode === ModalStateEnum.BOX && (
        <CatalogsModal
          data={modal.data}
          handleClose={() => setModal(null)}
          handleReload={obtainCatalogs}
          companyId={companyId}
        />
      )}

      {modal?.mode === ModalStateEnum.DELETE && (
        <ConfirmDelete
          endpoint={`/catalogs/${modal.data?.id}`}
          handleClose={() => setModal(null)}
          handleReload={obtainCatalogs}
        />
      )}
    </Box>
  );
};

export default CatalogsTab;

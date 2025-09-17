import AntTable, { AntColumnType } from '@/components/AntTable';
import { ClientProps } from '@/services/clients/clients';
import { ModalStateEnum } from '@/types/global.enum';
import { Delete, Edit, PermContactCalendar, MoreVert } from '@mui/icons-material';
import { FormHelperText, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { useState } from 'react';

interface ClientsTableProps {
  data: ClientProps[];
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: ClientProps) => void;
  hideActions?: boolean;
  modalMode?: boolean; // Nueva prop para indicar si está en modo modal
  onReload?: () => void;
}

const ClientsTable = ({ data, loading, hideActions, onRecordAction, modalMode, onReload }: ClientsTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<ClientProps | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, record: ClientProps) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecord(null);
  };

  const handleMenuAction = (action: ModalStateEnum) => {
    if (selectedRecord) {
      onRecordAction(action, selectedRecord);
    }
    handleMenuClose();
  };
  const columns: Array<AntColumnType<ClientProps> | false> = [
    { title: 'Razón Social', dataIndex: 'razonSocial', width: 200, filter: true, sort: true },
    { title: 'RUC', dataIndex: 'ruc', width: 150, filter: true, sort: true },
    { title: 'Sede', dataIndex: 'sede', width: 150, filter: true, sort: true },
    { title: 'Código Unidad', dataIndex: 'codigoUnidadEjecutora', width: 200, filter: true, sort: true },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      width: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>{[record.departamento, record.provincia, record.distrito].filter(Boolean).join(' - ')}</FormHelperText>
        </>
      ),
    },
    !hideActions && {
      title: 'Contactos',
      dataIndex: 'contactos',
      width: 120,
      render: (_, record) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<PermContactCalendar />}
          onClick={() => onRecordAction(ModalStateEnum.DRAWER, record)}
          sx={{ minWidth: 'auto' }}
        >
          Ver
        </Button>
      ),
    },
    !hideActions && {
      title: 'Acciones',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <IconButton
          size="small"
          onClick={(event) => handleMenuOpen(event, record)}
          aria-label="más acciones"
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  const filteredColumns = columns.filter((item) => !!item);

  return (
    <>
      <AntTable
        data={data}
        columns={filteredColumns}
        loading={loading}
        hideToolbar={modalMode} // Ocultar toolbar cuando esté en modo modal
        onReload={onReload}
        onRow={(record) => {
          if (!hideActions) return {};
          return {
            onClick: () => onRecordAction(ModalStateEnum.BOX, record),
            style: { cursor: 'pointer' },
          };
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuAction(ModalStateEnum.BOX)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction(ModalStateEnum.DELETE)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ClientsTable;

import { Delete, Edit, PermContactCalendar, RadioButtonChecked, RadioButtonUnchecked, MoreVert } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ProviderProps } from '@/services/providers/providers';
import { useState } from 'react';

interface ProvidersTableProps {
  data: Array<ProviderProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: ProviderProps) => void;
  hideActions?: boolean;
  onReload?: () => void;
}

const ProvidersTable = ({ data, loading, onRecordAction, hideActions, onReload }: ProvidersTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<ProviderProps | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, record: ProviderProps) => {
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
  const columns: Array<AntColumnType<ProviderProps> | false> = [
    { title: 'Razón social', dataIndex: 'razonSocial', width: 250, filter: true },
    { title: 'RUC', dataIndex: 'ruc', width: 150, filter: true },
    {
      title: 'Dirección',
      dataIndex: 'departamento',
      width: 300,
      render: (_, record) => (
        <div>
          <Typography variant="body2">{record.direccion}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {[record.departamento?.name, record.provincia?.name, record.distrito?.name].filter(Boolean).join(' - ')}
          </Typography>
        </div>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 100,
      render: (value) => (value ? <RadioButtonChecked color="success" /> : <RadioButtonUnchecked color="error" />),
    },
    { title: 'Correo electrónico', dataIndex: 'email', width: 200, filter: true },
    { title: 'Teléfono', dataIndex: 'telefono', width: 150, filter: true },
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
      fixed: 'right',
      align: 'center',
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
        columns={filteredColumns}
        data={data}
        loading={loading}
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

export default ProvidersTable;

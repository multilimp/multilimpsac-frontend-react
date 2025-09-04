import { Delete, Edit, PermContactCalendar, MoreVert } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { TransportProps } from '@/services/transports/transports';
import { useState } from 'react';

interface TransportsTableProps {
  data: Array<TransportProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: TransportProps) => void;
  onReload?: () => void;
}

const TransportsTable = ({ data, loading, onRecordAction, onReload }: TransportsTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<TransportProps | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, record: TransportProps) => {
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
  const columns: Array<AntColumnType<TransportProps>> = [
    { title: 'Razón social', dataIndex: 'razonSocial', width: 250, filter: true, sort: true },
    { title: 'RUC', dataIndex: 'ruc', width: 150, filter: true, sort: true },
    { title: 'Correo electrónico', dataIndex: 'email', width: 200, filter: true, sort: true },
    { title: 'Teléfono', dataIndex: 'telefono', width: 150, filter: true, sort: true },
    { title: 'Cobertura', dataIndex: 'cobertura', width: 150, filter: true, sort: true },
    {
      title: 'Dirección',
      dataIndex: 'departamento',
      width: 300,
      render: (_, record) => (
        <div>
          <Typography variant="body2">{record.direccion}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {[record.departamento, record.provincia, record.distrito].filter(Boolean).join(' - ')}
          </Typography>
        </div>
      ),
    },
    {
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
    {
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

  return (
    <>
      <AntTable columns={columns} data={data} loading={loading} onReload={onReload} />

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

export default TransportsTable;

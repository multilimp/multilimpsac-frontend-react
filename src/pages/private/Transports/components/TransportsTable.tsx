import { Delete, Edit, PermContactCalendar, MoreVert, Payment } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { TransportProps } from '@/services/transports/transports';
import { useState } from 'react';

interface TransportsTableProps {
  data: Array<TransportProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum | 'MANAGE_PAGOS', data: TransportProps) => void;
  hideActions?: boolean;
  modalMode?: boolean;
  onReload?: () => void;
}

const TransportsTable = ({ data, loading, onRecordAction, hideActions, modalMode, onReload }: TransportsTableProps) => {
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

  const handleMenuAction = (action: ModalStateEnum | 'MANAGE_PAGOS') => {
    if (selectedRecord) {
      onRecordAction(action, selectedRecord);
    }
    handleMenuClose();
  };
  const columns: Array<AntColumnType<TransportProps> | false> = [
    { title: 'Razón social', dataIndex: 'razonSocial', width: 250, filter: true, sort: true },
    { title: 'RUC', dataIndex: 'ruc', width: 150, filter: true, sort: true },
    { title: 'Correo electrónico', dataIndex: 'email', width: 200, filter: true, sort: true },
    { title: 'Teléfono', dataIndex: 'telefono', width: 150, filter: true, sort: true },
    { title: 'Cobertura', dataIndex: 'cobertura', width: 150, filter: true, sort: true },
    {
      title: 'Dirección',
      dataIndex: 'departamento',
      width: 300,
      render: (_: unknown, record: TransportProps) => (
        <div>
          <Typography variant="body2">{record.direccion}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {[record.departamento, record.provincia, record.distrito].filter(Boolean).join(' - ')}
          </Typography>
        </div>
      ),
    },
    {
      title: 'Saldo',
      dataIndex: 'saldo',
      width: 140,
      render: (_: unknown, record: TransportProps) => {
        const value = Number(record.saldo || 0);
        const isFavor = record.saldoTipo === 'A_FAVOR';
        const color = isFavor ? 'success.main' : value < 0 ? 'error.main' : 'text.primary';
        return (
          <Typography variant="body2" sx={{ color }}>
            S/ {Math.abs(value).toFixed(2)}
          </Typography>
        );
      },
    },
    !hideActions && {
      title: 'Contactos',
      dataIndex: 'contactos',
      width: 120,
      render: (_: unknown, record: TransportProps) => (
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
      title: 'Pagos',
      dataIndex: 'pagos',
      width: 120,
      render: (_: unknown, record: TransportProps) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Payment />}
          onClick={() => onRecordAction('MANAGE_PAGOS', record)}
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
      render: (_: unknown, record: TransportProps) => (
        <IconButton
          size="small"
          onClick={(event) => handleMenuOpen(event, record)}
          aria-label="más acciones"
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ].filter(Boolean) as Array<AntColumnType<TransportProps>>;

  const filteredColumns = columns.filter((item) => !!item);

  return (
    <>
      <AntTable
        columns={filteredColumns}
        data={data}
        loading={loading}
        onReload={onReload}
        autoRefreshMs={300000}
        refetchOnFocus
        refetchOnReconnect
        hideToolbar={modalMode}
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

export default TransportsTable;

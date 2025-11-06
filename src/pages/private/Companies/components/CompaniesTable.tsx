import { Delete, Edit, MoreVert, Visibility, FolderOpen } from '@mui/icons-material';
import { CompanyProps } from '@/services/companies/company';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Avatar, IconButton, Menu, MenuItem, FormHelperText, Typography, ListItemIcon, ListItemText, Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { useState } from 'react';

interface CompaniesTableProps {
  data: Array<CompanyProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: CompanyProps) => void;
  onReload?: () => void;
}

const CompaniesTable = ({ data, loading, onRecordAction, onReload }: CompaniesTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<CompanyProps | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, record: CompanyProps) => {
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

  const columns: Array<AntColumnType<CompanyProps>> = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      width: 75,
      render: (value, record) => <Avatar src={value} alt={record.razonSocial} />,
    },
    { title: 'Razón social', dataIndex: 'razonSocial', width: 250, filter: true, sort: true },
    { title: 'RUC', dataIndex: 'ruc', width: 200, filter: true, sort: true },
    {
      title: 'Dirección',
      dataIndex: 'departamento',
      width: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>{[record.departamento, record.provincia, record.distrito].filter(Boolean).join(' - ')}</FormHelperText>
        </>
      ),
    },
    {
      title: 'Catálogos',
      dataIndex: 'catalogos',
      width: 120,
      render: (_, record) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<FolderOpen />}
          onClick={() => {
            onRecordAction(ModalStateEnum.DRAWER, record);
          }}
          sx={{ minWidth: 'auto' }}
        >
          Ver
        </Button>
      ),
    },
    { title: 'Correo electrónico', dataIndex: 'email', width: 200, filter: true, sort: true },
    { title: 'Teléfono', dataIndex: 'telefono', width: 150, filter: true, sort: true },
    {
      title: 'Acciones',
      dataIndex: 'id',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <>
          <IconButton
            size="small"
            onClick={(event) => handleMenuOpen(event, record)}
            aria-label="más acciones"
          >
            <MoreVert />
          </IconButton>
        </>
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

export default CompaniesTable;

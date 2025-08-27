import AntTable, { AntColumnType } from '@/components/AntTable';
import { ClientProps } from '@/services/clients/clients';
import { ModalStateEnum } from '@/types/global.enum';
import { Delete, Edit, PermContactCalendar } from '@mui/icons-material';
import { Button, ButtonGroup, FormHelperText, Typography } from '@mui/material';

interface ClientsTableProps {
  data: ClientProps[];
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: ClientProps) => void;
  hideActions?: boolean;
  modalMode?: boolean; // Nueva prop para indicar si está en modo modal
}

const ClientsTable = ({ data, loading, hideActions, onRecordAction, modalMode }: ClientsTableProps) => {
  const columns: Array<AntColumnType<ClientProps> | false> = [
    { title: 'RUC', dataIndex: 'ruc', width: 150, filter: true, sort: true },
    { title: 'Razón Social', dataIndex: 'razonSocial', width: 200, filter: true, sort: true },
    { title: 'Código Unidad', dataIndex: 'codigoUnidadEjecutora', width: 200, filter: true, sort: true },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      width: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>{[record.departamento?.name, record.provincia?.name, record.distrito?.name].filter(Boolean).join(' - ')}</FormHelperText>
        </>
      ),
    },
    !hideActions && {
      title: 'Acciones',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <ButtonGroup size="small" sx={{ bgcolor: '#fff' }}>
          <Button color="warning" onClick={() => onRecordAction(ModalStateEnum.DRAWER, record)}>
            <PermContactCalendar />
          </Button>
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

  const filteredColumns = columns.filter((item) => !!item);

  return (
    <AntTable
      data={data}
      columns={filteredColumns}
      loading={loading}
      hideToolbar={modalMode} // Ocultar toolbar cuando esté en modo modal
      onRow={(record) => {
        if (!hideActions) return {};
        return {
          onClick: () => onRecordAction(ModalStateEnum.BOX, record),
          style: { cursor: 'pointer' },
        };
      }}
    />
  );
};

export default ClientsTable;

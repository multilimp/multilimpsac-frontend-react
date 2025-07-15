import { Delete, Edit, PermContactCalendar, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Button, ButtonGroup, Typography } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ProviderProps } from '@/services/providers/providers';

interface ProvidersTableProps {
  data: Array<ProviderProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: ProviderProps) => void;
  hideActions?: boolean;
}

const ProvidersTable = ({ data, loading, onRecordAction, hideActions }: ProvidersTableProps) => {
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
      title: 'Acciones',
      dataIndex: 'id',
      fixed: 'right',
      align: 'center',
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
      columns={filteredColumns}
      data={data}
      loading={loading}
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

export default ProvidersTable;

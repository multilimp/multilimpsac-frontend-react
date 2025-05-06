import { Delete, Edit, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Button, ButtonGroup, FormHelperText, Typography } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ProviderProps } from '@/services/providers/providers';

interface ProvidersTableProps {
  data: Array<ProviderProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: ProviderProps) => void;
}

const ProvidersTable = ({ data, loading, onRecordAction }: ProvidersTableProps) => {
  const columns: Array<AntColumnType<ProviderProps>> = [
    { title: 'Razón social', dataIndex: 'razonSocial', width: 250, filter: true },
    { title: 'RUC', dataIndex: 'ruc', width: 150, filter: true },
    {
      title: 'Dirección',
      dataIndex: 'departamento',
      width: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>
            <FormHelperText>{[record.departamento?.name, record.provincia?.name, record.distrito?.name].filter(Boolean).join(' - ')}</FormHelperText>
          </FormHelperText>
        </>
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
    {
      title: 'Acciones',
      dataIndex: 'id',
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <ButtonGroup size="small">
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

  return <AntTable columns={columns} data={data} loading={loading} />;
};

export default ProvidersTable;

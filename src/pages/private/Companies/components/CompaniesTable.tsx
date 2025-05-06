import { Delete, Edit } from '@mui/icons-material';
import { CompanyProps } from '@/services/companies/company';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Avatar, Button, ButtonGroup, FormHelperText, Typography } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';

interface CompaniesTableProps {
  data: Array<CompanyProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: CompanyProps) => void;
}

const CompaniesTable = ({ data, loading, onRecordAction }: CompaniesTableProps) => {
  const columns: Array<AntColumnType<CompanyProps>> = [
    {
      title: 'Acciones',
      dataIndex: 'id',
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
    {
      title: 'Logo',
      dataIndex: 'logo',
      minWidth: 75,
      render: (value, record) => <Avatar src={value} alt={record.razonSocial} />,
    },
    { title: 'Razón social', dataIndex: 'razonSocial', minWidth: 150, filter: true },
    { title: 'RUC', dataIndex: 'ruc', minWidth: 100, filter: true },
    { title: 'Teléfono', dataIndex: 'telefono', minWidth: 100, filter: true },
    { title: 'Correo electrónico', dataIndex: 'email', minWidth: 200, filter: true },
    {
      title: 'Dirección',
      dataIndex: 'departamento',
      minWidth: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>{[record.departamento?.name, record.provincia?.name, record.distrito?.name].filter(Boolean).join(' - ')}</FormHelperText>
        </>
      ),
    },
    { title: 'Web', dataIndex: 'web', minWidth: 250 },
  ];

  return <AntTable columns={columns} data={data} loading={loading} />;
};

export default CompaniesTable;

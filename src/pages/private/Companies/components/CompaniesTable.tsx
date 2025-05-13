
import { Delete, Edit, ViewList } from '@mui/icons-material';
import { CompanyProps } from '@/services/companies/company';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Avatar, Button, ButtonGroup, FormHelperText, Typography } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';

interface CompaniesTableProps {
  data: Array<CompanyProps>;
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: CompanyProps) => void;
  onSelectCompany?: (company: CompanyProps) => void;
}

const CompaniesTable = ({ data, loading, onRecordAction, onSelectCompany }: CompaniesTableProps) => {
  const columns: Array<AntColumnType<CompanyProps>> = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      width: 75,
      render: (value, record) => <Avatar src={value} alt={record.razonSocial} />,
    },
    { title: 'Razón social', dataIndex: 'razonSocial', width: 150, filter: true },
    { title: 'RUC', dataIndex: 'ruc', width: 110, filter: true },
    { title: 'Teléfono', dataIndex: 'telefono', width: 150, filter: true },
    { title: 'Correo electrónico', dataIndex: 'email', width: 200, filter: true },
    {
      title: 'Dirección',
      dataIndex: 'departamento',
      width: 300,
      render: (_, record) => (
        <>
          <Typography variant="body2">{record.direccion}</Typography>
          <FormHelperText>{[record.departamento?.name, record.provincia?.name, record.distrito?.name].filter(Boolean).join(' - ')}</FormHelperText>
        </>
      ),
    },
    { title: 'Web', dataIndex: 'web', width: 250 },
    {
      title: 'Acciones',
      dataIndex: 'id',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <ButtonGroup size="small">
          {onSelectCompany && (
            <Button color="primary" onClick={() => onSelectCompany(record)}>
              <ViewList />
            </Button>
          )}
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

export default CompaniesTable;

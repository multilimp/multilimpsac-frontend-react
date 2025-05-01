import { Delete, Edit } from '@mui/icons-material';
import { CompanyProps } from '@/services/companies/company';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { Avatar, Button, ButtonGroup, FormHelperText, Typography } from '@mui/material';

interface CompaniesTableProps {
  data: Array<CompanyProps>;
  loading: boolean;
}

const CompaniesTable = ({ data, loading }: CompaniesTableProps) => {
  const columns: Array<AntColumnType<CompanyProps>> = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      minWidth: 75,
      render: (value, record) => <Avatar src={value} alt={record.razon_social} />,
    },
    { title: 'Razón social', dataIndex: 'razon_social', minWidth: 150, filter: true },
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
          <FormHelperText>
            {record.departamento} - {record.provincia} - {record.distrito}
          </FormHelperText>
        </>
      ),
    },
    { title: 'Web', dataIndex: 'web' },
    {
      title: 'Acciones',
      dataIndex: 'id',
      render: () => (
        <ButtonGroup size="small">
          <Button color="info" endIcon={<Edit />}>
            Editar
          </Button>
          <Button color="error" endIcon={<Delete />}>
            Eliminar
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  return <AntTable columns={columns} data={data} loading={loading} />;
};

export default CompaniesTable;

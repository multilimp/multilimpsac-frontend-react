// src/components/treasurys/TreasurysTable.tsx
import { Delete, Edit } from '@mui/icons-material';
import { Button, ButtonGroup } from '@mui/material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { TreasurysProps } from '@/services/treasurys/treasurys.d';
import { ModalStateEnum } from '@/types/global.enum';

interface TreasurysTableProps {
  data: TreasurysProps[];
  loading: boolean;
  onRecordAction: (action: ModalStateEnum, data: TreasurysProps) => void;
}

export default function TreasurysTable({
  data,
  loading,
  onRecordAction,
}: TreasurysTableProps) {
  const columns: AntColumnType<TreasurysProps>[] = [
    {
      title: 'Acciones',
      dataIndex: 'id',
      render: (_, record) => (
        <ButtonGroup size="small">
          <Button
            color="info"
            onClick={() => onRecordAction(ModalStateEnum.BOX, record)}
          >
            <Edit />
          </Button>
          <Button
            color="error"
            onClick={() => onRecordAction(ModalStateEnum.DELETE, record)}
          >
            <Delete />
          </Button>
        </ButtonGroup>
      ),
    },
    { title: 'Código Venta', dataIndex: 'saleCode', filter: true },
    { title: 'Razón Social Cliente', dataIndex: 'clientBusinessName', filter: true },
    { title: 'RUC Cliente', dataIndex: 'clientRuc', filter: true },
    { title: 'RUC Empresa', dataIndex: 'companyRuc', filter: true },
    { title: 'Razón Social Empresa', dataIndex: 'companyBusinessName', filter: true },
    { title: 'Contacto', dataIndex: 'contact', filter: true },
    { title: 'Estado', dataIndex: 'status', filter: true },
  ];

  return <AntTable columns={columns} data={data} loading={loading} />;
}

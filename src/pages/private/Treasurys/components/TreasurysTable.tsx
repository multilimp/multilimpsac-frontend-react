// src/components/treasurys/TreasurysTable.tsx
import { Delete, Edit, Payment } from '@mui/icons-material';
import { Button, ButtonGroup } from '@mui/material';
import AntTable, { AntColumnType } from '@/components/AntTable';
import { TreasurysProps } from '@/services/treasurys/treasurys.d';
import { ModalStateEnum } from '@/types/global.enum';
import { useNavigate } from 'react-router-dom';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

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
  const navigate = useNavigate();
  const { setSelectedSale } = useGlobalInformation();
  const handleManagePayments = (record: TreasurysProps) => {
    // Crear un mock de SaleProps basado en TreasurysProps para demo
    const mockSale = {
      id: record.id,
      codigoVenta: record.saleCode,
      // Añadir campos mínimos necesarios para SaleProps
      empresaRuc: record.companyRuc,
      empresaRazonSocial: record.companyBusinessName,
      clienteRuc: record.clientRuc,
      clienteRazonSocial: record.clientBusinessName,
      contacto: record.contact,
      fechaEmision: new Date().toISOString(),
      ventaPrivada: false,
      direccionEntrega: '',
      referenciaEntrega: '',
      fechaEntrega: new Date().toISOString(),
      montoVenta: '0',
      fechaForm: new Date().toISOString(),
      fechaMaxForm: new Date().toISOString(),
      productos: [],
      documentoOce: '',
      documentoOcf: '',
      siaf: '',
      etapaSiaf: '',
      fechaSiaf: new Date().toISOString(),
      etapaActual: 'treasury',
      estadoActivo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSelectedSale(mockSale as any);
    navigate(`/treasury/${record.id}/update`);
  };

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
            color="success"
            onClick={() => handleManagePayments(record)}
            title="Gestionar Pagos"
          >
            <Payment />
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

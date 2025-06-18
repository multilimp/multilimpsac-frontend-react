import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, Stack } from '@mui/material';
import TreasuryFormContent from './components/TreasuryFormContent';
import { SaleProps } from '@/services/sales/sales';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

// Datos de prueba para hacer el componente independiente
const mockSaleData: SaleProps = {
  id: 1,
  codigoVenta: 'MOCK-SALE-001',
  fechaEmision: '2024-12-01T00:00:00.000Z',
  archivoOc: undefined,
  empresaId: 1,
  clienteId: 1,
  contactoClienteId: 1,
  catalogoEmpresaId: 1,
  ventaPrivada: false,
  departamentoEntrega: 'Lima',
  provinciaEntrega: 'Lima',
  distritoEntrega: 'Miraflores',
  direccionEntrega: 'Av. Ejemplo 123, Miraflores',
  referenciaEntrega: 'Frente al parque central',
  fechaEntrega: '2024-12-15T00:00:00.000Z',
  montoVenta: '15000.00',
  fechaForm: '2024-12-01T00:00:00.000Z',
  fechaMaxForm: '2024-12-30T00:00:00.000Z',
  productos: [
    {
      descripcion: 'Servicio de Limpieza',
      cantidad: 10,
      codigo : 'SL-001',
      marca : 'Marca A',
    },
    {
      descripcion: 'Servicio de Mantenimiento',
      cantidad: 5,
      codigo : 'SM-001',
      marca : 'Marca B',
    }
  ],
  documentoOce: 'OCE-2024-001.pdf',
  documentoOcf: 'OCF-2024-001.pdf',
  siaf: '12345',
  etapaSiaf: 'CERTIFICADO',
  fechaSiaf: '2024-12-01T00:00:00.000Z',
  documentoPeruCompras: undefined,
  fechaPeruCompras: undefined,
  fechaEntregaOc: '2024-12-15T00:00:00.000Z',
  penalidad: undefined,
  netoCobrado: undefined,
  estadoCobranza: 'PENDIENTE',
  fechaEstadoCobranza: undefined,
  fechaProximaGestion: undefined,
  etapaActual: 'TESORERIA',
  estadoActivo: true,
  createdAt: '2024-12-01T00:00:00.000Z',
  updatedAt: '2024-12-01T00:00:00.000Z',
  empresa: {
    id: 1,
    ruc: '20123456789',
    razonSocial: 'MULTILIMP S.A.C.',
    direccion: 'Av. Empresa 456, Lima',
    telefono: '+51 999 111 222',
    email: 'contacto@multilimp.com',
    web: 'https://multilimp.com',
    logo: 'multilimp-logo.png',
    departamento: {
      id: '15',
      name: 'Lima'
    },
    provincia: {
      id: '1501',
      name: 'Lima',
      department_id: '15'
    },
    distrito: {
      id: '150114',
      name: 'Miraflores',
      province_id: '1501',
      department_id: '15'
    }
  },
  cliente: {
    id: 1,
    ruc: '20987654321',
    razonSocial: 'CLIENTE EJEMPLO S.A.C.',
    direccion: 'Av. Cliente 789, Lima',
    telefono: '+51 999 333 444',
    email: 'cliente@ejemplo.com',
    codigoUnidadEjecutora: 'CUE001',
    estado: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    departamento: {
      id: '15',
      name: 'Lima'
    },
    provincia: {
      id: '1501',
      name: 'Lima',
      department_id: '15'
    },
    distrito: {
      id: '150114',
      name: 'Miraflores',
      province_id: '1501',
      department_id: '15'
    }
  },  contactoCliente: {
    id: 1,
    nombre: 'Ana García',
    cargo: 'Gerente de Compras',
    telefono: '+51 999 555 666',
    email: 'ana.garcia@ejemplo.com',
    tipo: ContactTypeEnum.CLIENTE,
    referenciaId: 1,
    clienteId: 1
  },
  catalogoEmpresa: {
    id: 1,
    nombre: 'Catálogo Servicios Integrales',
    descripcion: 'Servicios de limpieza y mantenimiento',
    empresa: {
      id: 1,
      ruc: '20123456789',
      razonSocial: 'MULTILIMP S.A.C.',
      direccion: 'Av. Empresa 456, Lima',
      telefono: '+51 999 111 222',
      email: 'contacto@multilimp.com',
      web: 'https://multilimp.com',
      logo: 'multilimp-logo.png',
      departamento: {
        id: '15',
        name: 'Lima'
      },
      provincia: {
        id: '1501',
        name: 'Lima',
        department_id: '15'
      },
      distrito: {
        id: '150114',
        name: 'Miraflores',
        province_id: '1501',
        department_id: '15'
      }
    }
  },
  ordenesProveedor: []
};

const TreasuryForm = () => {
  const { saleId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos una carga de datos
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      message.info(`${saleId ? 'Modo actualización' : 'Modo creación'} - Usando datos de prueba`);
    }, 500);

    return () => clearTimeout(timer);
  }, [saleId]);

  return (
    <Stack direction="column" spacing={2}>
      <Card>
        <CardHeader 
          title={`${saleId ? `Actualizar Tesorería - ID: ${saleId}` : 'Crear'} Registro de Tesorería`} 
          slotProps={{ title: { fontWeight: 700, fontSize: 24 } }} 
        />
      </Card>

      {!isLoading && <TreasuryFormContent sale={mockSaleData} />}
    </Stack>
  );
};

export default TreasuryForm;

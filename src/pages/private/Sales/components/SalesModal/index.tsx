import { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Fab, Stack, Step, Stepper, Typography } from '@mui/material';
import { Form, notification } from 'antd';
import { Close } from '@mui/icons-material';
import InputsFirstStep from './InputsFirstStep';
import InputsSecondStep from './InputsSecondStep';
import InputsThirdStep from './InputsThirdStep';
import InputsFourthStep from './InputsFourthStep';
import InputsFifthStep from './InputsFifthStep';
import { uploadFile } from '@/services/files/file.requests';
import { createSale } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import dayjs from 'dayjs';

interface SalesModalProps {
  handleClose: VoidFunction;
  handleReload: VoidFunction;
  data?: SaleProps;
  processed: boolean;
}

const SalesModal = ({ handleClose, handleReload, data, processed }: SalesModalProps) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      direccionEntrega: data.direccionEntrega ?? '',
      etapaSIAF: data.etapaSiaf,
      fechaEntrega: data.fechaEntrega ? dayjs(data.fechaEntrega) : null,
      fechaFormalizacion: data.fechaForm ? dayjs(data.fechaForm) : null,
      fechaMaxEntrega: data.fechaMaxForm ? dayjs(data.fechaMaxForm) : null,
      fechaSIAF: data.fechaSiaf ? dayjs(data.fechaSiaf) : null,
      montoVenta: data.montoVenta,
      productos: Array.isArray(data.productos) ? data.productos : [],
      referenciaEntrega: data.referenciaEntrega,
      numeroSIAF: data.siaf,
      tipoVenta: data.ventaPrivada ? 'privada' : 'directa',
    });
  }, [data]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);

      // const [urlOCE, urlOCF] = await Promise.all([uploadFile(values.ordenCompraElectronica), uploadFile(values.ordenCompraFisica)]);

      const body = {
        empresaId: values.empresa,
        ventaPrivada: values.tipoVenta === 'privada',

        fechaEmision: new Date().toISOString(),

        clienteId: values.cliente,
        departamentoEntrega: JSON.stringify(values.regionEntregaComplete),
        provinciaEntrega: JSON.stringify(values.provinciaEntregaComplete),
        distritoEntrega: JSON.stringify(values.distritoEntregaComplete),
        direccionEntrega: values.direccionEntrega,
        referenciaEntrega: values.referenciaEntrega,
        fechaEntrega: values.fechaEntrega.toISOString(),

        catalogoEmpresaId: values.catalogo,
        fechaForm: values.fechaFormalizacion.toISOString(),
        fechaMaxForm: values.fechaMaxEntrega.toISOString(),
        montoVenta: Number(values.montoVenta),
        siaf: values.numeroSIAF,
        etapaSiaf: values.etapaSIAF,
        fechaSiaf: values.fechaSIAF.toISOString(),
        // documentoOce: urlOCE,
        // documentoOcf: urlOCF,
        documentoOce: 'https://www.sammobile.com/wp-content/uploads/2023/12/Files-By-Google.jpg',
        documentoOcf: 'https://www.sammobile.com/wp-content/uploads/2023/12/Files-By-Google.jpg',

        contactoClienteId: values.cargoContacto,

        productos: values.productos,
      };

      await createSale(body);

      handleClose();
      handleReload();

      notification.success({ message: 'La venta fue registrada correctamente' });
    } catch (error) {
      notification.error({ message: 'No se logró registrar la venta', description: `Intente mas tarde. ${error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open fullScreen>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" color="primary">
            REGISTRAR NUEVA VENTA
          </Typography>
          <Fab onClick={handleClose} size="small" disabled={loading}>
            <Close />
          </Fab>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Form form={form} onFinish={handleFinish}>
          <Stepper activeStep={step} orientation="vertical">
            <Step active={step === 1}>
              <InputsFirstStep form={form} dback next={handleNext} />
            </Step>

            <Step active={step === 2}>
              <InputsSecondStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 3}>
              <InputsThirdStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 4}>
              <InputsFourthStep form={form} back={handleBack} next={handleNext} />
            </Step>

            <Step active={step === 5}>
              <InputsFifthStep form={form} back={handleBack} next={handleNext} />
            </Step>
          </Stepper>

          {step === 6 && (
            <Stack alignItems="center" justifyContent="center" my={5}>
              <Typography variant="h5">Completaste todos los pasos correctamante</Typography>
              <Stack direction="row" mt={3} spacing={2}>
                <Button variant="outlined" onClick={() => handleBack()} disabled={loading}>
                  Volver al último paso
                </Button>
                <Button loading={loading} type="submit">
                  Finalizar y registrar venta
                </Button>
              </Stack>
            </Stack>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SalesModal;

const EDIT_DATA = {
  id: 5,
  codigoVenta: 'OC789',
  fechaEmision: '2025-05-08T00:00:00.000Z',
  archivoOc: null,
  empresaId: 1,
  clienteId: 4,
  contactoClienteId: null,
  catalogoEmpresaId: null,
  ventaPrivada: false,
  provinciaEntrega: null,
  distritoEntrega: null,
  departamentoEntrega: null,
  direccionEntrega: null,
  referenciaEntrega: null,
  fechaEntrega: null,
  montoVenta: '1500',
  fechaForm: null,
  fechaMaxForm: null,
  productos: [
    {
      nombre: 'Producto A',
      cantidad: 100,
      precioUnitario: 1000,
    },
  ],
  documentoOce: null,
  documentoOcf: null,
  siaf: null,
  etapaSiaf: null,
  fechaSiaf: null,
  documentoPeruCompras: null,
  fechaPeruCompras: null,
  fechaEntregaOc: null,
  penalidad: null,
  netoCobrado: null,
  estadoCobranza: null,
  fechaEstadoCobranza: null,
  fechaProximaGestion: null,
  etapaActual: 'creacion',
  estadoActivo: true,
  createdAt: '2025-05-09T02:43:24.584Z',
  updatedAt: '2025-05-09T02:43:24.584Z',
  empresa: {
    id: 1,
    razonSocial: 'asdasdas',
    ruc: '20252333233',
    direccion: 'asdsadasdasd',
    telefono: '902046246',
    email: 'asdasd@gmail.com',
    departamento: '02',
    provincia: '0202',
    distrito: '020201',
    logo: null,
    direcciones: null,
    web: 'Av Huancavelica nro 465 - El Tambo',
    createdAt: '2025-05-05T23:58:18.455Z',
    updatedAt: '2025-05-05T23:58:18.455Z',
  },
  cliente: {
    id: 4,
    razonSocial: 'RAXON SOCIAL',
    ruc: '20146232332',
    direccion: 'ADDRESS',
    telefono: null,
    email: null,
    estado: true,
    codigoUnidadEjecutora: 'COD-0001',
    departamento: '{"id":"05","name":"Ayacucho"}',
    provincia: '{"id":"0503","name":"Huanca Sancos","department_id":"05"}',
    distrito: '{"id":"050302","name":"Carapo","province_id":"0503","department_id":"05"}',
    createdAt: '2025-05-07T02:13:36.036Z',
    updatedAt: '2025-05-07T02:13:36.036Z',
  },
  contactoCliente: null,
  catalogoEmpresa: null,
  ordenesProveedor: [],
};

const PROCESSED_DATA = {
  ventaPrivada: false,
  provinciaEntrega: 'APURÍMAC',
  distritoEntrega: 'TAMBURCO',
  departamentoEntrega: 'ABANCAY',
  direccionEntrega: 'JR. CAHUIDE N°101',
  referenciaEntrega: 'POSTA DE SALUD DE TAMBURCO AL COSTADO',
  fechaEntrega: '2024-12-02T00:00:00.000Z',
  montoVenta: 2303.69,
  fechaForm: null,
  fechaMaxForm: null,
  productos: [
    'HIPOCLORITO DE SODIO: LEJIA LÍQUIDO HIPOCLORITO DE SODIO: 5% CLORO DISPONIBLE: 5.00 -5.20% CONT.: GALÓN MARCA: X4 LT G.F: 12 MESES - 1 AÑO UNIDAD MARCA: JOGRANSA LEJIA TRADICIONAL JLT4L',
  ],
  siaf: 1762,
  etapaSiaf: 'NORMAL',
  fechaSiaf: null,
};

const FORM_VALUES_AFTER_CREATE_SUBMIT = {
  empresaComplete: {
    id: 1,
    razonSocial: 'asdasdas',
    ruc: '20252333233',
    direccion: 'asdsadasdasd',
    telefono: '902046246',
    email: 'asdasd@gmail.com',
    departamento: '02',
    provincia: '0202',
    distrito: '020201',
    logo: null,
    direcciones: null,
    web: 'Av Huancavelica nro 465 - El Tambo',
    createdAt: '2025-05-05T23:58:18.455Z',
    updatedAt: '2025-05-05T23:58:18.455Z',
  },
  empresa: 1,
  tipoVenta: 'directa',
  clienteComplete: {
    id: 5,
    razonSocial: 'RAXON SOCIAL 2',
    ruc: '20254344434',
    direccion: 'Direcció completa',
    telefono: null,
    email: null,
    estado: true,
    codigoUnidadEjecutora: 'CODIGO DE UNIDAD EXTRA',
    departamento: {
      id: '01',
      name: 'Amazonas',
    },
    provincia: {
      id: '0104',
      name: 'Condorcanqui',
      department_id: '01',
    },
    distrito: {
      id: '010403',
      name: 'Rio Santiago',
      province_id: '0104',
      department_id: '01',
    },
    createdAt: '2025-05-07T02:14:05.471Z',
    updatedAt: '2025-05-07T02:14:05.471Z',
  },
  cliente: 5,
  regionEntregaComplete: {
    id: '03',
    name: 'ApurImac',
  },
  regionEntrega: '03',
  provinciaEntregaComplete: {
    id: '0302',
    name: 'Andahuaylas',
    department_id: '03',
  },
  provinciaEntrega: '0302',
  distritoEntregaComplete: {
    id: '030201',
    name: 'Andahuaylas',
    province_id: '0302',
    department_id: '03',
  },
  distritoEntrega: '030201',
  fechaEntrega: '2025-05-06T05:00:00.000Z',
  direccionEntrega: 'qweqwe',
  referenciaEntrega: 'asdasdasdasd',
  fechaFormalizacion: '2025-05-13T05:00:00.000Z',
  fechaMaxEntrega: '2025-05-06T05:00:00.000Z',
  montoVenta: '12321323',
  numeroSIAF: '12323',
  etapaSIAF: 'SSIAF',
  fechaSIAF: '2025-05-20T05:00:00.000Z',
  ordenCompraElectronica: {
    uid: 'rc-upload-1746816948554-3',
  },
  ordenCompraFisica: {
    uid: 'rc-upload-1746816948554-5',
  },
  productos: ['adasdasdasd', 'asdasdasd', 'asdasdasd'],
  catalogoComplete: {
    id: 1,
    nombre: 'Ofertas Verano',
    descripcion: 'Catálogo de productos variados',
    empresaId: 2,
    createdAt: '2025-05-09T05:06:26.741Z',
    updatedAt: '2025-05-09T05:25:24.896Z',
    empresa: {
      id: 2,
      razonSocial: 'RAZON SOCIAL',
      ruc: '12312333222',
      direccion: 'asdasdasdasd',
      telefono: '987654321',
      email: 'RAZONSOCIA@GMAIL.COM',
      departamento: '03',
      provincia: '0301',
      distrito: '030102',
      logo: null,
      direcciones: null,
      web: 'WEB.COM',
      createdAt: '2025-05-06T01:13:25.789Z',
      updatedAt: '2025-05-06T01:13:25.789Z',
    },
  },
  catalogo: 1,
  cargoContactoComplete: {
    id: 4,
    nombre: 'Ana López',
    telefono: '987654321',
    email: 'ana.lopez@example.com',
    cargo: 'Gerente de Compras',
    cumpleanos: null,
    nota: null,
    usuarioDestacado: null,
    tipo: 'CLIENTE',
    referenciaId: 4,
    clienteId: 4,
    proveedorId: null,
    transporteId: null,
    createdAt: '2025-05-09T04:54:21.696Z',
    updatedAt: '2025-05-09T04:54:21.696Z',
  },
  cargoContacto: 4,
  nombreContacto: 'Gerente de Compras',
  celularContacto: '987654321',
};

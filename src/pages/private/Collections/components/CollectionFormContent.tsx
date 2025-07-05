import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Stack, 
  Typography, 
  Card, 
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import { 
  ArrowBack, 
  Save,
  Business,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { notification, Spin, Form, Input, DatePicker, Select, Modal, Row, Col } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import dayjs from 'dayjs';
import { 
  getGestionesCobranza, 
  updateCobranza, 
  createGestionCobranza, 
  updateGestionCobranza, 
  deleteGestionCobranza,
  getCobranzaByOrdenCompra,
  type GestionCobranza,
  type CobranzaData
} from '@/services/cobranza/cobranza.service';

interface CollectionFormContentProps {
  sale: SaleProps;
}

const estadosCobranzaOptions = [
  { label: 'Normal', value: 'NORMAL' },
  { label: 'REQ - Requerimiento', value: 'REQ' },
  { label: 'PC1 - Primer Cobro', value: 'PC1' },
  { label: 'PC2 - Segundo Cobro', value: 'PC2' },
  { label: 'PC3 - Tercer Cobro', value: 'PC3' },
  { label: 'CI - Carta de Intimación', value: 'CI' },
  { label: 'RP - Reclamo Patrimonial', value: 'RP' },
  { label: 'DJ - Demanda Judicial', value: 'DJ' }
];

const etapasSiafOptions = [
  { label: 'Compromiso', value: 'COMPROMISO' },
  { label: 'Devengado', value: 'DEVENGADO' },
  { label: 'Girado', value: 'GIRADO' },
  { label: 'Pagado', value: 'PAGADO' }
];

const tipoCobranzaOptions = [
  { label: 'Gestión telefónica', value: 'TELEFONICA' },
  { label: 'Visita presencial', value: 'PRESENCIAL' },
  { label: 'Correo electrónico', value: 'EMAIL' },
  { label: 'Carta notarial', value: 'CARTA_NOTARIAL' },
  { label: 'Reunión coordinación', value: 'REUNION' }
];

export const CollectionFormContent = ({ sale }: CollectionFormContentProps) => {
  const [form] = Form.useForm();
  const [gestionForm] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gestiones, setGestiones] = useState<GestionCobranza[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGestion, setEditingGestion] = useState<GestionCobranza | null>(null);
  const [gestionesLoading, setGestionesLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [sale.id]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Cargar datos de cobranza
      const cobranzaData = await getCobranzaByOrdenCompra(sale.id);
      
      // Configurar el formulario con los datos
      form.setFieldsValue({
        etapaSiaf: cobranzaData.etapaSiaf || '',
        fechaSiaf: cobranzaData.fechaSiaf ? dayjs(cobranzaData.fechaSiaf) : null,
        retencion: cobranzaData.retencion || '',
        detraccion: cobranzaData.detraccion || '',
        penalidad: cobranzaData.penalidad || '',
        netoCobrado: cobranzaData.netoCobrado || '',
        estadoCobranza: cobranzaData.estadoCobranza || '',
        fechaEstadoCobranza: cobranzaData.fechaEstadoCobranza ? dayjs(cobranzaData.fechaEstadoCobranza) : null,
      });

      // Cargar gestiones
      await loadGestiones();
      
    } catch (error) {
      console.error('Error loading collection data:', error);
      notification.error({
        message: 'Error al cargar datos',
        description: 'No se pudieron cargar los datos de cobranza'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGestiones = async () => {
    try {
      setGestionesLoading(true);
      const gestionesData = await getGestionesCobranza(sale.id);
      setGestiones(gestionesData);
    } catch (error) {
      console.error('Error loading gestiones:', error);
      notification.error({
        message: 'Error al cargar gestiones',
        description: 'No se pudieron cargar las gestiones de cobranza'
      });
      setGestiones([]); // Inicializar como array vacío en caso de error
    } finally {
      setGestionesLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/collections');
  };

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      
      const formData: CobranzaData = {
        etapaSiaf: values.etapaSiaf,
        fechaSiaf: values.fechaSiaf ? values.fechaSiaf.format('YYYY-MM-DD') : undefined,
        retencion: values.retencion,
        detraccion: values.detraccion,
        penalidad: values.penalidad,
        netoCobrado: values.netoCobrado,
        estadoCobranza: values.estadoCobranza,
        fechaEstadoCobranza: values.fechaEstadoCobranza ? values.fechaEstadoCobranza.format('YYYY-MM-DD') : undefined,
      };
      
      await updateCobranza(sale.id, formData);
      notification.success({
        message: 'Cobranza actualizada',
        description: 'La información de cobranza se ha actualizado correctamente'
      });
      navigate('/collections');
      
    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo guardar la información de cobranza'
      });
      console.error('Error saving collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGestion = () => {
    setEditingGestion(null);
    gestionForm.resetFields();
    setModalVisible(true);
  };

  const handleEditGestion = (gestion: GestionCobranza) => {
    setEditingGestion(gestion);
    gestionForm.setFieldsValue({
      ...gestion,
      fechaGestion: gestion.fechaGestion ? dayjs(gestion.fechaGestion) : undefined
    });
    setModalVisible(true);
  };

  const handleSaveGestion = async (values: Record<string, any>) => {
    try {
      const gestionData: Partial<GestionCobranza> = {
        ordenCompraId: sale.id,
        fechaGestion: values.fechaGestion ? values.fechaGestion.format('YYYY-MM-DD') : '',
        notaGestion: values.notaGestion || '',
        estadoCobranza: values.estadoCobranza || '',
        tipoCobranza: values.tipoCobranza || '',
        voucherPagoUrl: values.voucherPagoUrl || '',
        pagoConformeTesoreria: values.pagoConformeTesoreria || false,
        cartaAmpliacionUrl: values.cartaAmpliacionUrl || '',
        capturaEnvioDocumentoUrl: values.capturaEnvioDocumentoUrl || '',
        archivosAdjuntosNotasGestion: values.archivosAdjuntosNotasGestion || '',
        documentosRegistrados: values.documentosRegistrados || '',
        notaEspecialEntrega: values.notaEspecialEntrega || '',
        usuarioId: 1 // TODO: Obtener del contexto de usuario
      };

      if (editingGestion) {
        // Editar gestión existente
        const updatedGestion = await updateGestionCobranza(editingGestion.id!, gestionData);
        const updatedGestiones = gestiones.map(g => 
          g.id === editingGestion.id ? updatedGestion : g
        );
        setGestiones(updatedGestiones);
      } else {
        // Agregar nueva gestión
        const newGestion = await createGestionCobranza(gestionData as Omit<GestionCobranza, 'id' | 'createdAt' | 'updatedAt'>);
        setGestiones([newGestion, ...gestiones]);
      }

      setModalVisible(false);
      gestionForm.resetFields();
      
      notification.success({
        message: 'Gestión guardada',
        description: 'La gestión se ha guardado correctamente'
      });
    } catch (error) {
      notification.error({
        message: 'Error al guardar gestión',
        description: 'No se pudo guardar la gestión'
      });
      console.error('Error saving gestion:', error);
    }
  };

  const handleDeleteGestion = (id: number) => {
    Modal.confirm({
      title: '¿Eliminar gestión?',
      content: '¿Está seguro de que desea eliminar esta gestión?',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await deleteGestionCobranza(id);
          setGestiones(gestiones.filter(g => g.id !== id));
          notification.success({
            message: 'Gestión eliminada',
            description: 'La gestión se ha eliminado correctamente'
          });
        } catch (error) {
          notification.error({
            message: 'Error al eliminar gestión',
            description: 'No se pudo eliminar la gestión'
          });
          console.error('Error deleting gestion:', error);
        }
      }
    });
  };

  const getEstadoLabel = (estado: string) => {
    const option = estadosCobranzaOptions.find(opt => opt.value === estado);
    return option ? option.label : estado;
  };

  const getTipoLabel = (tipo: string) => {
    const option = tipoCobranzaOptions.find(opt => opt.value === tipo);
    return option ? option.label : tipo;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Spin spinning={loading}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={handleBack} color="primary">
              <ArrowBack />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                Gestión de Cobranza
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sale.codigoVenta} • {sale.cliente?.razonSocial}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Barra Negra de OP */}
        <StepItemContent 
          showHeader={true} 
          headerLeft={`OP: ${sale.codigoVenta}`}
          headerRight={`Cliente: ${sale.cliente?.razonSocial}`}
          color="#2c3e50"
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Información de la Orden de Proveedor para Cobranza
            </Typography>
          </Box>
        </StepItemContent>

        {/* Información General de la OC */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Business color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Información de la Orden de Compra
              </Typography>
            </Stack>
            
            <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Código OC:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{sale.codigoVenta}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Importe Total:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'primary.main' }}>
                  {formatCurrency(parseInt(sale.montoVenta, 10))}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Cliente:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{sale.cliente?.razonSocial}</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Gestiones - Grid 3x3 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <MoneyIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Gestiones de Cobranza
              </Typography>
            </Stack>

            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Row gutter={[24, 16]}>
                {/* Fila 1 */}
                <Col span={8}>
                  <Form.Item 
                    label="Importe Total OC" 
                    name="importeTotal"
                    initialValue={formatCurrency(parseInt(sale.montoVenta, 10))}
                  >
                    <Input readOnly style={{ backgroundColor: '#f5f5f5' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Etapa SIAF" name="etapaSiaf">
                    <Select placeholder="Seleccionar etapa" options={etapasSiafOptions} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Fecha SIAF" name="fechaSiaf">
                    <DatePicker style={{ width: '100%' }} placeholder="Seleccionar fecha" />
                  </Form.Item>
                </Col>

                {/* Fila 2 */}
                <Col span={8}>
                  <Form.Item label="Retención" name="retencion">
                    <Input placeholder="0.00" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Detracción" name="detraccion">
                    <Input placeholder="0.00" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Penalidad" name="penalidad">
                    <Input placeholder="0.00" />
                  </Form.Item>
                </Col>

                {/* Fila 3 */}
                <Col span={8}>
                  <Form.Item label="Neto Cobrado" name="netoCobrado">
                    <Input placeholder="0.00" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Estado de Cobranza Morosa" name="estadoCobranza">
                    <Select placeholder="Seleccionar estado" options={estadosCobranzaOptions} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Fecha Estado de Cobranzas" name="fechaEstadoCobranza">
                    <DatePicker style={{ width: '100%' }} placeholder="Seleccionar fecha" />
                  </Form.Item>
                </Col>
              </Row>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={handleBack}>
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => form.submit()}
                  startIcon={<Save />}
                  disabled={loading}
                >
                  Guardar Cobranza
                </Button>
              </Box>
            </Form>
          </CardContent>
        </Card>

        {/* Historial de Gestiones */}
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ReceiptIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Historial de Gestiones
                </Typography>
              </Stack>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddGestion}
                size="small"
              >
                Nueva Gestión
              </Button>
            </Stack>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nota</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gestionesLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Spin />
                      </TableCell>
                    </TableRow>
                  ) : gestiones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          No hay gestiones registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    gestiones.map((gestion) => (
                      <TableRow key={gestion.id} hover>
                        <TableCell>
                          {gestion.fechaGestion ? formattedDate(gestion.fechaGestion) : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getTipoLabel(gestion.tipoCobranza)} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getEstadoLabel(gestion.estadoCobranza)} 
                            size="small"
                            color={gestion.estadoCobranza === 'NORMAL' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {gestion.notaGestion || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditGestion(gestion)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteGestion(gestion.id!)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Spin>

      {/* Modal para gestiones */}
      <Modal
        title={editingGestion ? 'Editar Gestión' : 'Nueva Gestión'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={gestionForm}
          layout="vertical"
          onFinish={handleSaveGestion}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="Fecha de Gestión" 
                name="fechaGestion"
                rules={[{ required: true, message: 'Seleccione una fecha' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Tipo de Cobranza" 
                name="tipoCobranza"
                rules={[{ required: true, message: 'Seleccione un tipo' }]}
              >
                <Select options={tipoCobranzaOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item 
                label="Estado de Cobranza" 
                name="estadoCobranza"
                rules={[{ required: true, message: 'Seleccione un estado' }]}
              >
                <Select options={estadosCobranzaOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            label="Nota de Gestión" 
            name="notaGestion"
            rules={[{ required: true, message: 'Ingrese una nota' }]}
          >
            <Input.TextArea rows={4} placeholder="Detalle de la gestión realizada..." />
          </Form.Item>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={() => setModalVisible(false)}>
              Cancelar
            </Button>
            <Button
              style={{ backgroundColor: '#1976d2', color: 'white' }}
              onClick={() => gestionForm.submit()}
            >
              {editingGestion ? 'Actualizar' : 'Crear'} Gestión
            </Button>
          </Box>
        </Form>
      </Modal>
    </Box>
  );
};

export default CollectionFormContent;

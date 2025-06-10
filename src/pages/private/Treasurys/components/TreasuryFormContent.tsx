import { useState, useEffect, Fragment } from 'react';
import { Spin, Form, Button as AntButton, Space, message } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Stack,
    Grid,
    Typography,
    IconButton,
    FormHelperText,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { Delete, Add, Payment } from '@mui/icons-material';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency } from '@/utils/functions';
// import PurchaseOrderCard from '@/components/PurchaseOrderCard'; // COMENTADO TEMPORALMENTE
import InputAntd from '@/components/InputAntd';
import DatePickerAntd from '@/components/DatePickerAnt';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputFile from '@/components/InputFile';

interface TreasuryFormContentProps {
    sale: SaleProps;
}

const getEmptyPaymentRecord = () => ({
    date: null,
    bank: '',
    description: '',
    file: null,
    amount: '',
    status: 'activo',
});

const statusOptions = [
    { label: 'Activo', value: 'activo' },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Procesado', value: 'procesado' },
    { label: 'Cancelado', value: 'cancelado' },
];

const requiredField = { required: true, message: 'Campo requerido' };

const mockOrderData = {
    proveedor: 'PROVEEDOR EJEMPLO S.A.C.',
    contactoProveedor: 'Juan Pérez',
    fechaRecepcion: '2024-12-15',
    fechaProgramada: '2024-12-20',
    fechaDespacho: '2024-12-18',
    productos: [
        {
            codigo: 'PROD001',
            descripcion: 'Producto de ejemplo 1',
            uMedida: 'UND',
            cantidad: '10',
            cAlmacen: '8',
            cTotal: '18',
            precioUnitario: '50.00',
            total: '500.00',
        },
        {
            codigo: 'PROD002',
            descripcion: 'Producto de ejemplo 2',
            uMedida: 'KG',
            cantidad: '5',
            cAlmacen: '3',
            cTotal: '8',
            precioUnitario: '25.00',
            total: '125.00',
        },
    ],
    productosNota: 'Nota de productos de ejemplo',
    transportes: [
        {
            transporte: 'TRANSPORTES LIMA S.A.C.',
            contacto: 'María García',
            destino: 'CLIENTE',
            region: 'Lima',
            provincia: 'Lima',
            distrito: 'Miraflores',
            direccion: 'Av. Larco 123, Miraflores',
            nota: 'Entregar en horario de oficina',
            cotizacion: 'cotizacion_transporte.pdf',
        },],
};

// const COLUMN_WIDTH = 350; // COMENTADO TEMPORALMENTE - No se usa sin PurchaseOrderCard

const TreasuryFormContent = ({ sale }: TreasuryFormContentProps) => {
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(mockOrderData);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // TODO: Aquí se cargarían los datos reales de la orden de proveedor
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setOrderData(mockOrderData);
            form.setFieldsValue({
                pagosProductos: [],
                pagosTransporte0: [],
            });
            setLoading(false);
        }, 1000);
    }, [sale.id, form]);
    const handleSave = async (values: any) => {
        try {
            setLoading(true);
            console.log('📊 Datos del formulario de pagos:', values);
            // Aquí iría la lógica para guardar en la base de datos
            // await saveTreasuryPayments(sale.id, values);

            message.success('Datos de pagos guardados exitosamente');
            navigate('/treasury');
        } catch (error) {
            console.error('❌ Error al guardar:', error);
            message.error('Error al guardar los datos de pagos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            {/* COMENTADO TEMPORALMENTE - Información de la Orden de Compra */}
            {/* <Box width={{ xs: '100%', lg: COLUMN_WIDTH }}>
                <PurchaseOrderCard />
            </Box> */}

            <Box width={{ xs: '100%', lg: '100%' }}>
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSave} initialValues={{
                            pagosProductos: [],
                            pagosTransporte0: [],
                        }}
                    >
                        <Stack spacing={1}>
                            <Card>
                                <CardHeader title="DATOS GENERALES" slotProps={{ title: { fontWeight: 700, fontSize: 16 } }} />
                                <CardContent sx={{ py: '0 !important' }}>
                                    <Grid container columnSpacing={2} rowSpacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Typography variant="body2" color="text.secondary">Proveedor</Typography>
                                            <Typography variant="body1" fontWeight={500}>{orderData.proveedor}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Typography variant="body2" color="text.secondary">Contacto del proveedor</Typography>
                                            <Typography variant="body1" fontWeight={500}>{orderData.contactoProveedor}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                                            <Typography variant="body2" color="text.secondary">Fecha de recepción</Typography>
                                            <Typography variant="body1" fontWeight={500}>{orderData.fechaRecepcion}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                                            <Typography variant="body2" color="text.secondary">Fecha programada</Typography>
                                            <Typography variant="body1" fontWeight={500}>{orderData.fechaProgramada}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
                                            <Typography variant="body2" color="text.secondary">Fecha de despacho</Typography>
                                            <Typography variant="body1" fontWeight={500}>{orderData.fechaDespacho}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader title="PRODUCTOS" slotProps={{ title: { fontWeight: 700, fontSize: 16 } }} />
                                <CardContent>
                                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>N°</strong></TableCell>
                                                    <TableCell><strong>Código</strong></TableCell>
                                                    <TableCell><strong>Descripción</strong></TableCell>
                                                    <TableCell><strong>U.M.</strong></TableCell>
                                                    <TableCell align="right"><strong>Cantidad</strong></TableCell>
                                                    <TableCell align="right"><strong>C.Almacén</strong></TableCell>
                                                    <TableCell align="right"><strong>C.Total</strong></TableCell>
                                                    <TableCell align="right"><strong>P.Unitario</strong></TableCell>
                                                    <TableCell align="right"><strong>Total</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {orderData.productos.map((product, index) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{product.codigo}</TableCell>
                                                        <TableCell sx={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.descripcion}</TableCell>
                                                        <TableCell>{product.uMedida}</TableCell>
                                                        <TableCell align="right">{product.cantidad}</TableCell>
                                                        <TableCell align="right">{product.cAlmacen}</TableCell>
                                                        <TableCell align="right">{product.cTotal}</TableCell>
                                                        <TableCell align="right">{formatCurrency(parseFloat(product.precioUnitario))}</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(parseFloat(product.total))}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={8} align="right"><strong>TOTAL PRODUCTOS:</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1.1em', color: 'primary.main' }}>
                                                        {formatCurrency(orderData.productos.reduce((total, product) => total + parseFloat(product.total), 0))}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" color="text.secondary">Nota</Typography>
                                        <Typography variant="body1">{orderData.productosNota}</Typography>
                                    </Box>
                                    {/* Se aplica ml: 2 y bgcolor: '#f0f8f0' para igualar el estilo de pagos de transporte */}
                                    <Card variant="outlined" sx={{ ml: 2, bgcolor: '#f0f8f0' }}>
                                        <CardHeader
                                            title={
                                                <Typography variant="h6" fontWeight={600} component={Stack} direction="row" alignItems="flex-end" spacing={1}>
                                                    <Payment />
                                                    PAGOS DE PRODUCTOS
                                                </Typography>
                                            }
                                            slotProps={{ title: { fontWeight: 600, fontSize: 14 } }}
                                        />
                                        <CardContent>
                                            <Form.List
                                                name="pagosProductos"
                                                initialValue={[]}
                                            >
                                            {(fields, { add, remove }, { errors }) => (
                                                <Fragment>
                                                    {fields.length === 0 ? (
                                                        // Se ajusta bgcolor y border para igualar el estilo de pagos de transporte
                                                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f0f8f0', borderRadius: 1, border: '2px dashed #c3d9c3' }}>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                                No hay pagos registrados para productos
                                                            </Typography>
                                                            <Button
                                                                size="medium"
                                                                variant="contained"
                                                                startIcon={<Add />}
                                                                onClick={() => add(getEmptyPaymentRecord())}
                                                                sx={{
                                                                    bgcolor: '#006DFA',
                                                                    '&:hover': {
                                                                        bgcolor: '#0056cc',
                                                                    },
                                                                }}
                                                            >
                                                                CREAR PRIMER PAGO DE PRODUCTOS
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            {fields.map((field, index) => (
                                                                <Box key={field.name} sx={{ border: '1px solid #eee', p: 2, mb: 2, borderRadius: '4px' }}>
                                                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
                                                                        Pago de Producto N° {index + 1}
                                                                    </Typography>
                                                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                                                        <Grid container columnSpacing={2} sx={{ flex: 1 }}>
                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                <Form.Item name={[field.name, 'date']} rules={[requiredField]}>
                                                                                    <DatePickerAntd label="Fecha de Pago" />
                                                                                </Form.Item>
                                                                            </Grid>
                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                <Form.Item name={[field.name, 'bank']} rules={[requiredField]}>
                                                                                    <InputAntd label="Banco" />
                                                                                </Form.Item>
                                                                            </Grid>
                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                <Form.Item name={[field.name, 'amount']} rules={[requiredField]}>
                                                                                    <InputAntd label="Monto" type="number" />
                                                                                </Form.Item>
                                                                            </Grid>
                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                <Form.Item name={[field.name, 'status']} rules={[requiredField]}>
                                                                                    <SelectGeneric label="Estado" options={statusOptions} />
                                                                                </Form.Item>
                                                                            </Grid>
                                                                            <Grid size={12}>
                                                                                <Form.Item name={[field.name, 'description']}>
                                                                                    <InputAntd label="Descripción" />
                                                                                </Form.Item>
                                                                            </Grid>
                                                                            <Grid size={12}>
                                                                                <Form.Item name={[field.name, 'file']}>
                                                                                    <InputFile label="Comprobante" />
                                                                                </Form.Item>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <IconButton color="error" onClick={() => remove(field.name)} sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </Stack>
                                                                </Box>
                                                            ))}
                                                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                                                                <Button
                                                                    size="medium"
                                                                    variant="outlined"
                                                                    startIcon={<Add />}
                                                                    onClick={() => add(getEmptyPaymentRecord())}
                                                                    sx={{
                                                                        borderColor: '#006DFA',
                                                                        color: '#006DFA',
                                                                        '&:hover': {
                                                                            borderColor: '#111826',
                                                                            bgcolor: '#006DFA',
                                                                            color: 'white',
                                                                        },
                                                                    }}
                                                                >
                                                                    AGREGAR PAGO DE PRODUCTOS
                                                                </Button>
                                                                {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                                                                <Box sx={{ textAlign: 'right' }}>
                                                                    <Typography variant="caption" color="textSecondary" display="block">
                                                                        Total Pagos de Productos
                                                                    </Typography>
                                                                    <Form.Item noStyle shouldUpdate>
                                                                        {({ getFieldValue }) => {
                                                                            const sumPayments = (getFieldValue('pagosProductos') ?? []).reduce(
                                                                                (acum: number, next: { amount: string }) => acum + (next.amount ? parseFloat(next.amount) : 0),
                                                                                0
                                                                            );

                                                                            return (
                                                                                <Typography variant="h6" color={errors.length ? 'error' : 'primary'} sx={{ fontWeight: 600 }}>
                                                                                    {formatCurrency(sumPayments)}
                                                                                </Typography>
                                                                            );
                                                                        }}
                                                                    </Form.Item>
                                                                </Box>
                                                            </Stack>
                                                        </>
                                                    )}
                                                </Fragment>
                                            )}
                                        </Form.List>
                                        <Form.Item name="notaPagosProductos" style={{ marginTop: '16px' }}>
                                            <InputAntd label="Nota General de Pagos de Productos" type="textarea" />
                                        </Form.Item>
                                        </CardContent>
                                    </Card>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader title="TRANSPORTES ASIGNADOS" slotProps={{ title: { fontWeight: 700, fontSize: 16 } }} />
                                <CardContent>
                                    <Stack direction="column" spacing={2}>
                                        {orderData.transportes.map((transport, transportIndex) => (
                                            <Fragment key={transportIndex}>
                                                <Card variant="outlined">
                                                    <CardHeader title={`TRANSPORTE N° ${transportIndex + 1}`} />
                                                    <CardContent sx={{ py: '0 !important' }}>
                                                        <Grid container columnSpacing={2} rowSpacing={2}>
                                                            <Grid size={{ xs: 12, md: 6, lg: 6, xl: 3 }}>
                                                                <Typography variant="body2" color="text.secondary">Transporte</Typography>
                                                                <Typography variant="body1" fontWeight={500}>{transport.transporte}</Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, md: 6, lg: 6, xl: 3 }}>
                                                                <Typography variant="body2" color="text.secondary">Transporte contacto</Typography>
                                                                <Typography variant="body1" fontWeight={500}>{transport.contacto}</Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, md: 6, lg: 6, xl: 3 }}>
                                                                <Typography variant="body2" color="text.secondary">Destino</Typography>
                                                                <Typography variant="body1" fontWeight={500}>{transport.destino}</Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, md: 6, lg: 6, xl: 3 }}>
                                                                <Typography variant="body2" color="text.secondary">Cotización</Typography>
                                                                <Typography variant="body1" fontWeight={500}>{transport.cotizacion}</Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                                <Typography variant="body2" color="text.secondary">Departamento</Typography>
                                                                <Typography variant="body1" fontWeight={500}>{transport.region}</Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                                <Typography variant="body2" color="text.secondary">Provincia</Typography>
                                                                <Typography variant="body1" fontWeight={500}>{transport.provincia}</Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                                                <Typography variant="body2" color="text.secondary">Distrito</Typography>
                                                                <Typography variant="body1" fontWeight={500}>{transport.distrito}</Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 12 }}>
                                                                <Typography variant="body2" color="text.secondary">Dirección</Typography>
                                                                <Typography variant="body1" fontWeight={500}>{transport.direccion}</Typography>
                                                            </Grid>
                                                            <Grid size={12}>
                                                                <Typography variant="body2" color="text.secondary">Nota</Typography>
                                                                <Typography variant="body1">{transport.nota}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>

                                                <Card variant="outlined" sx={{ ml: 2, bgcolor: '#f0f8f0' }}>
                                                    <CardHeader
                                                        title={
                                                            <Typography variant="h6" fontWeight={600} component={Stack} direction="row" alignItems="flex-end" spacing={1}>
                                                                <Payment />
                                                                FLETE PAGADO - TRANSPORTE {transportIndex + 1}
                                                            </Typography>
                                                        }
                                                        slotProps={{ title: { fontWeight: 600, fontSize: 14 } }}
                                                    />
                                                    <CardContent>
                                                        <Form.List
                                                            name={`pagosTransporte${transportIndex}`}
                                                            initialValue={[]}
                                                        >
                                                            {(fields, { add, remove }, { errors }) => (
                                                                <Fragment>
                                                                    {fields.length === 0 ? (
                                                                        <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f0f8f0', borderRadius: 1, border: '2px dashed #c3d9c3' }}>
                                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                                                No hay pagos de flete registrados para este transporte
                                                                            </Typography>
                                                                            <Button
                                                                                size="medium"
                                                                                variant="contained"
                                                                                startIcon={<Add />}
                                                                                onClick={() => add(getEmptyPaymentRecord())}
                                                                                sx={{
                                                                                    bgcolor: '#28a745',
                                                                                    '&:hover': {
                                                                                        bgcolor: '#218838',
                                                                                    },
                                                                                }}
                                                                            >
                                                                                CREAR PRIMER PAGO DE FLETE
                                                                            </Button>
                                                                        </Box>
                                                                    ) : (
                                                                        <>
                                                                            {fields.map((field, index) => (
                                                                                <Box key={field.name} sx={{ border: '1px solid #d3e0d3', p: 2, mb: 2, borderRadius: '4px' }}>
                                                                                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
                                                                                        Pago de Flete N° {index + 1}
                                                                                    </Typography>
                                                                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                                                                        <Grid container columnSpacing={2} sx={{ flex: 1 }}>
                                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                                <Form.Item name={[field.name, 'date']} rules={[requiredField]}>
                                                                                                    <DatePickerAntd label="Fecha de Pago" />
                                                                                                </Form.Item>
                                                                                            </Grid>
                                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                                <Form.Item name={[field.name, 'bank']} rules={[requiredField]}>
                                                                                                    <InputAntd label="Banco" />
                                                                                                </Form.Item>
                                                                                            </Grid>
                                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                                <Form.Item name={[field.name, 'amount']} rules={[requiredField]}>
                                                                                                    <InputAntd label="Monto" type="number" />
                                                                                                </Form.Item>
                                                                                            </Grid>
                                                                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                                                                <Form.Item name={[field.name, 'status']} rules={[requiredField]}>
                                                                                                    <SelectGeneric label="Estado" options={statusOptions} />
                                                                                                </Form.Item>
                                                                                            </Grid>
                                                                                            <Grid size={{ xs: 12, md: 6 }}>
                                                                                                <Form.Item name={[field.name, 'description']} rules={[requiredField]}>
                                                                                                    <InputAntd label="Descripción del Pago" />
                                                                                                </Form.Item>
                                                                                            </Grid>
                                                                                            <Grid size={{ xs: 12, md: 6 }}>
                                                                                                <Form.Item name={[field.name, 'file']}>
                                                                                                    <InputFile
                                                                                                        onChange={(file) => form.setFieldValue([`pagosTransporte${transportIndex}`, field.name, 'file'], file)}
                                                                                                        accept="pdf"
                                                                                                        label="Comprobante de Pago"
                                                                                                    />
                                                                                                </Form.Item>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                        <IconButton size="small" color="error" onClick={() => remove(field.name)} sx={{ mt: 1 }}>
                                                                                            <Delete />
                                                                                        </IconButton>
                                                                                    </Stack>
                                                                                </Box>
                                                                            ))}

                                                                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                                                                                <Button
                                                                                    size="medium"
                                                                                    variant="outlined"
                                                                                    startIcon={<Add />}
                                                                                    onClick={() => add(getEmptyPaymentRecord())}
                                                                                    sx={{
                                                                                        borderColor: '#28a745',
                                                                                        color: '#28a745',
                                                                                        '&:hover': {
                                                                                            borderColor: '#28a745',
                                                                                            bgcolor: '#28a745',
                                                                                            color: 'white',
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    AGREGAR PAGO DE FLETE
                                                                                </Button>
                                                                                {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                                                                                <Box sx={{ textAlign: 'right' }}>
                                                                                    <Typography variant="caption" color="textSecondary" display="block">
                                                                                        Total Flete
                                                                                    </Typography>
                                                                                    <Form.Item noStyle shouldUpdate>
                                                                                        {({ getFieldValue }) => {
                                                                                            const sumPayments = (getFieldValue(`pagosTransporte${transportIndex}`) ?? []).reduce(
                                                                                                (acum: number, next: { amount: string }) => acum + (next.amount ? parseFloat(next.amount) : 0),
                                                                                                0
                                                                                            );

                                                                                            return (
                                                                                                <Typography variant="h5" color={errors.length ? 'error' : 'success.main'} sx={{ fontWeight: 600 }}>
                                                                                                    {formatCurrency(sumPayments)}
                                                                                                </Typography>
                                                                                            );
                                                                                        }}
                                                                                    </Form.Item>
                                                                                </Box>
                                                                            </Stack>
                                                                        </>
                                                                    )}
                                                                </Fragment>
                                                            )}
                                                        </Form.List>
                                                        <Form.Item name={`notaPagosTransporte${transportIndex}`} style={{ marginTop: '16px' }}>
                                                            <InputAntd label="Nota General de Pagos de Flete" type="textarea" />
                                                        </Form.Item>
                                                    </CardContent>
                                                </Card>
                                            </Fragment>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card sx={{ mt: 2 }}>
                                <CardContent>
                                    <Space>
                                        <AntButton
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                            size="large"
                                            loading={loading}
                                        >
                                            Guardar Pagos
                                        </AntButton>
                                        <AntButton
                                            icon={<ArrowLeftOutlined />}
                                            size="large"
                                            onClick={() => navigate('/treasury')}
                                        >
                                            Cancelar
                                        </AntButton>
                                    </Space>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Form>
                </Spin>
            </Box>
        </Stack>
    );
};

export default TreasuryFormContent;
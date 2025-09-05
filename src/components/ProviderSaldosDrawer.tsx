import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Drawer,
    IconButton,
    Stack,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    Alert
} from '@mui/material';
import {
    AccountBalance as AccountBalanceIcon,
    Close as CloseIcon,
    Add as AddIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    CreditCard as CreditCardIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Delete as DeleteIcon,
    Edit as EditIcon
} from '@mui/icons-material';
import { Form, Input, Select, InputNumber, notification, Skeleton, message } from 'antd';
import {
    getProviderFinancialData,
    createProviderSaldo,
    updateSaldo,
    deleteSaldo
} from '@/services/saldos/saldos.request';
import { EntidadFinancieraData, SaldoData } from '@/services/saldos/saldos.service';
import { formatCurrency } from '@/utils/functions';
import { heroUIColors } from './ui/index';

interface ProviderSaldosDrawerProps {
    handleClose: VoidFunction;
    providerId: number;
    providerName: string;
    onSaldoUpdated?: VoidFunction;
}

const ProviderSaldosDrawer = ({
    handleClose,
    providerId,
    providerName,
    onSaldoUpdated
}: ProviderSaldosDrawerProps) => {
    const [financialData, setFinancialData] = useState<EntidadFinancieraData | null>(null);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [showBankCards, setShowBankCards] = useState(false);
    const [showSaldos, setShowSaldos] = useState(true);
    const [editingSaldo, setEditingSaldo] = useState<SaldoData | null>(null);

    useEffect(() => {
        if (providerId) {
            loadFinancialData();
        }
    }, [providerId]);

    const loadFinancialData = async () => {
        try {
            setLoading(true);
            const data = await getProviderFinancialData(providerId);
            setFinancialData(data);
        } catch (error) {
            console.error('Error cargando datos financieros:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar los datos financieros del proveedor'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSaldo = async (values: any) => {
        try {
            const saldoData = {
                tipoMovimiento: values.tipoMovimiento,
                monto: values.monto,
                descripcion: values.descripcion
            };

            if (editingSaldo) {
                await updateSaldo(editingSaldo.id, saldoData);
                message.success('Saldo actualizado correctamente');
            } else {
                await createProviderSaldo(providerId, saldoData);
                message.success('Saldo creado correctamente');
            }

            setOpenForm(false);
            setEditingSaldo(null);
            loadFinancialData();
            onSaldoUpdated?.();
        } catch (error) {
            message.error('Error al guardar el saldo');
        }
    };

    const handleDeleteSaldo = async (saldoId: number) => {
        try {
            await deleteSaldo(saldoId);
            message.success('Saldo eliminado correctamente');
            loadFinancialData();
            onSaldoUpdated?.();
        } catch (error) {
            message.error('Error al eliminar el saldo');
        }
    };

    const handleEditSaldo = (saldo: SaldoData) => {
        setEditingSaldo(saldo);
        setOpenForm(true);
    };

    const getSaldoColor = () => {
        if (!financialData || !financialData.resumenSaldo) return 'default';
        const { tipoSaldo } = financialData.resumenSaldo;

        switch (tipoSaldo) {
            case 'A_FAVOR': return 'success';
            case 'DEBE': return 'error';
            default: return 'default';
        }
    };

    const getSaldoIcon = () => {
        if (!financialData || !financialData.resumenSaldo) return null;
        const { tipoSaldo } = financialData.resumenSaldo;

        switch (tipoSaldo) {
            case 'A_FAVOR': return <TrendingUpIcon fontSize="small" />;
            case 'DEBE': return <TrendingDownIcon fontSize="small" />;
            default: return null;
        }
    };

    const getSaldoText = () => {
        if (!financialData || !financialData.resumenSaldo) return '';
        const { saldoNeto, tipoSaldo } = financialData.resumenSaldo;

        switch (tipoSaldo) {
            case 'A_FAVOR': return `Saldo a favor: ${formatCurrency(saldoNeto)}`;
            case 'DEBE': return `Deuda: ${formatCurrency(saldoNeto)}`;
            default: return 'Sin saldo';
        }
    };

    return (
        <Drawer
            open
            anchor="right"
            onClose={handleClose}
            sx={{
                '& .MuiDrawer-paper': {
                    background: '#0f1a2b',
                    width: { xs: '100vw', sm: 600 }
                }
            }}
        >
            <Box sx={{ width: '100%' }}>
                {/* Header */}
                <Box
                    sx={{
                        backgroundColor: '#1e293b',
                        color: 'white',
                        p: 3,
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <AccountBalanceIcon sx={{ fontSize: 32 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                                    GESTIÓN DE SALDOS
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    {providerName}
                                </Typography>
                            </Box>
                        </Stack>
                        <IconButton
                            onClick={handleClose}
                            disabled={loading}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    transform: 'scale(1.1)',
                                    transition: 'all 0.2s ease'
                                }
                            }}
                        >
                            <CloseIcon fontSize="large" />
                        </IconButton>
                    </Stack>

                    {/* Resumen financiero en el header */}
                    {financialData && financialData.resumenSaldo && (
                        <Box sx={{ mt: 2 }}>
                            <Chip
                                icon={getSaldoIcon() || undefined}
                                label={getSaldoText()}
                                color={getSaldoColor()}
                                size="medium"
                                variant="filled"
                                sx={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    '& .MuiChip-label': { px: 2 }
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Content area */}
                <Box sx={{
                    height: 'calc(100vh - 160px)',
                    overflow: 'auto',
                    p: 2,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(4, 186, 107, 0.1)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'linear-gradient(180deg, #04BA6B, #26c985)',
                        borderRadius: '4px',
                    },
                }}>
                    {loading ? (
                        <Stack direction="column" spacing={2}>
                            {[1, 2, 3].map((index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(4, 186, 107, 0.1) 30%, rgba(15, 26, 43, 0.8) 100%)',
                                        border: '1px solid rgba(4, 186, 107, 0.3)',
                                        borderRadius: 2,
                                        p: 2.5,
                                    }}
                                >
                                    <Skeleton.Input
                                        active
                                        size="large"
                                        style={{
                                            width: '100%',
                                            marginBottom: '16px',
                                            backgroundColor: 'rgba(4, 186, 107, 0.2)'
                                        }}
                                    />
                                    <Skeleton.Input
                                        active
                                        size="small"
                                        style={{
                                            width: '60%',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }}
                                    />
                                </Card>
                            ))}
                        </Stack>
                    ) : (
                        <Stack direction="column" spacing={3}>
                            {/* Resumen de saldos */}
                            {financialData && financialData.resumenSaldo && (
                                <Card
                                    sx={{
                                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(4, 186, 107, 0.1) 50%, rgba(15, 26, 43, 0.9) 100%)',
                                        border: '2px solid #04BA6B',
                                        borderRadius: 3,
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: '0 8px 32px rgba(4, 186, 107, 0.3)',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#04BA6B' }}>
                                            Resumen Financiero
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                                    Saldo a Favor:
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500} color="success.main">
                                                    {formatCurrency(financialData.resumenSaldo.saldoFavor)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                                    Saldo Deudor:
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500} color="error.main">
                                                    {formatCurrency(financialData.resumenSaldo.saldoDeuda)}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)' }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" fontWeight={600} color="white">
                                                    Saldo Neto:
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} color="white">
                                                    {formatCurrency(financialData.resumenSaldo.saldoNeto)}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Cuentas bancarias */}
                            {financialData && financialData.cuentasBancarias && financialData.cuentasBancarias.length > 0 && (
                                <Box>
                                    <Button
                                        size="small"
                                        startIcon={showBankCards ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        onClick={() => setShowBankCards(!showBankCards)}
                                        sx={{
                                            p: 1,
                                            color: '#04BA6B',
                                            '&:hover': { background: 'rgba(4, 186, 107, 0.1)' }
                                        }}
                                    >
                                        <CreditCardIcon sx={{ mr: 1 }} />
                                        Cuentas Bancarias ({financialData.cuentasBancarias?.length || 0})
                                    </Button>

                                    <Collapse in={showBankCards}>
                                        <Card
                                            sx={{
                                                mt: 1,
                                                background: 'rgba(30, 41, 59, 0.8)',
                                                border: '1px solid rgba(4, 186, 107, 0.3)'
                                            }}
                                        >
                                            <CardContent sx={{ p: 2 }}>
                                                <Stack spacing={1}>
                                                    {financialData.cuentasBancarias?.map((cuenta) => (
                                                        <Box
                                                            key={cuenta.id}
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                p: 1,
                                                                borderRadius: 1,
                                                                background: 'rgba(4, 186, 107, 0.05)'
                                                            }}
                                                        >
                                                            <Stack direction="row" spacing={2} alignItems="center">
                                                                <CreditCardIcon color="primary" fontSize="small" />
                                                                <Box>
                                                                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                                                                        {cuenta.banco}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                                                        {cuenta.numeroCuenta}
                                                                    </Typography>
                                                                    {cuenta.numeroCci && (
                                                                        <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                                                                            CCI: {cuenta.numeroCci}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </Stack>
                                                            <Chip
                                                                label={cuenta.moneda}
                                                                size="small"
                                                                color={cuenta.moneda === 'SOLES' ? 'primary' : 'secondary'}
                                                            />
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Collapse>
                                </Box>
                            )}

                            {/* Historial de saldos */}
                            {financialData && financialData.saldos && (
                                <Box>
                                    <Button
                                        size="small"
                                        startIcon={showSaldos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        onClick={() => setShowSaldos(!showSaldos)}
                                        sx={{
                                            p: 1,
                                            color: '#04BA6B',
                                            '&:hover': { background: 'rgba(4, 186, 107, 0.1)' }
                                        }}
                                    >
                                        Historial de Saldos ({financialData.saldos?.length || 0})
                                    </Button>

                                    <Collapse in={showSaldos}>
                                        {financialData.saldos && financialData.saldos.length > 0 ? (
                                            <TableContainer
                                                component={Paper}
                                                sx={{
                                                    mt: 1,
                                                    background: 'rgba(30, 41, 59, 0.8)',
                                                    border: '1px solid rgba(4, 186, 107, 0.3)'
                                                }}
                                            >
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ color: '#04BA6B', fontWeight: 600 }}>Fecha</TableCell>
                                                            <TableCell sx={{ color: '#04BA6B', fontWeight: 600 }}>Tipo</TableCell>
                                                            <TableCell sx={{ color: '#04BA6B', fontWeight: 600 }}>Monto</TableCell>
                                                            <TableCell sx={{ color: '#04BA6B', fontWeight: 600 }}>Descripción</TableCell>
                                                            <TableCell sx={{ color: '#04BA6B', fontWeight: 600 }}>Acciones</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {financialData.saldos?.map((saldo) => (
                                                            <TableRow key={saldo.id}>
                                                                <TableCell sx={{ color: 'white' }}>
                                                                    <Typography variant="body2">
                                                                        {new Date(saldo.fecha).toLocaleDateString()}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={saldo.tipoMovimiento === 'A_FAVOR' ? 'A Favor' : 'Deuda'}
                                                                        color={saldo.tipoMovimiento === 'A_FAVOR' ? 'success' : 'error'}
                                                                        size="small"
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'white' }}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                        {formatCurrency(saldo.monto)}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                                    <Typography variant="body2">
                                                                        {saldo.descripcion || '-'}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Stack direction="row" spacing={0.5}>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleEditSaldo(saldo)}
                                                                            sx={{ color: '#04BA6B' }}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleDeleteSaldo(saldo.id)}
                                                                            sx={{ color: 'error.main' }}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Stack>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <Box sx={{
                                                textAlign: 'center',
                                                py: 4,
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                borderRadius: 2,
                                                border: '2px dashed rgba(4, 186, 107, 0.3)',
                                                background: 'rgba(4, 186, 107, 0.05)',
                                                mt: 1
                                            }}>
                                                <AccountBalanceIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                                <Typography variant="h6" sx={{ mb: 1 }}>
                                                    Sin movimientos registrados
                                                </Typography>
                                                <Typography variant="body2">
                                                    Agrega el primer movimiento para comenzar
                                                </Typography>
                                            </Box>
                                        )}
                                    </Collapse>
                                </Box>
                            )}

                            {/* Botón/Formulario para agregar saldo */}
                            {openForm ? (
                                <SaldoForm
                                    handleClose={() => {
                                        setOpenForm(false);
                                        setEditingSaldo(null);
                                    }}
                                    onSubmit={handleCreateSaldo}
                                    editingSaldo={editingSaldo}
                                />
                            ) : (
                                <Card
                                    sx={{
                                        background: 'inherit',
                                        border: '1px dashed #04BA6B',
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <CardActionArea onClick={() => setOpenForm(true)} sx={{ p: 3 }}>
                                        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                                            <AddIcon sx={{ fontSize: 40, color: '#04BA6B' }} />
                                            <Typography variant="h6" sx={{ color: heroUIColors.secondary[500], fontWeight: 'bold' }}>
                                                Agregar Nuevo Saldo
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                                                Registra un nuevo movimiento financiero
                                            </Typography>
                                        </Stack>
                                    </CardActionArea>
                                </Card>
                            )}
                        </Stack>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
};

interface SaldoFormProps {
    handleClose: VoidFunction;
    onSubmit: (data: any) => void;
    editingSaldo?: SaldoData | null;
}

const SaldoForm = ({ handleClose, onSubmit, editingSaldo }: SaldoFormProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingSaldo) {
            form.setFieldsValue({
                tipoMovimiento: editingSaldo.tipoMovimiento,
                monto: editingSaldo.monto,
                descripcion: editingSaldo.descripcion
            });
        }
    }, [editingSaldo, form]);

    const handleSubmit = async (values: any) => {
        onSubmit(values);
        form.resetFields();
    };

    return (
        <Card
            sx={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(4, 186, 107, 0.1) 50%, rgba(15, 26, 43, 0.9) 100%)',
                border: '2px solid #04BA6B',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(4, 186, 107, 0.3)',
            }}
        >
            <CardHeader
                title={
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <AddIcon sx={{ color: '#04BA6B' }} />
                        <Typography variant="h6" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                            {editingSaldo ? 'Editar Saldo' : 'Nuevo Saldo'}
                        </Typography>
                    </Stack>
                }
                sx={{ pb: 1 }}
            />
            <CardContent sx={{ pt: 0 }}>
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <AccountBalanceIcon sx={{ color: '#04BA6B', fontSize: 20 }} />
                            <Typography variant="subtitle1" sx={{ color: '#04BA6B', fontWeight: 'bold' }}>
                                Información del Movimiento
                            </Typography>
                        </Stack>
                        <Divider sx={{ borderColor: 'rgba(4, 186, 107, 0.3)', mb: 2 }} />

                        <Form.Item
                            name="tipoMovimiento"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Tipo de Movimiento</span>}
                            rules={[{ required: true, message: 'Seleccione el tipo de movimiento' }]}
                            style={{ marginBottom: 16 }}
                        >
                            <Select
                                placeholder="Seleccionar tipo"
                                style={{ width: '100%' }}
                                size="large"
                            >
                                <Select.Option value="A_FAVOR">A Favor</Select.Option>
                                <Select.Option value="DEBE">Deuda</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="monto"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Monto</span>}
                            rules={[{ required: true, message: 'Ingrese el monto' }]}
                            style={{ marginBottom: 16 }}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                size="large"
                                placeholder="0.00"
                                min={0}
                                precision={2}
                                formatter={(value) => `S/ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: any) => value.replace(/S\/\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="descripcion"
                            label={<span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Descripción (Opcional)</span>}
                            style={{ marginBottom: 0 }}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Descripción del movimiento..."
                                maxLength={255}
                                size="large"
                            />
                        </Form.Item>
                    </Box>

                    <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                        <Button
                            fullWidth
                            type="submit"
                            sx={{
                                background: 'linear-gradient(135deg, #04BA6B 0%, #26c985 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                                py: 1.5,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #039354 0%, #04BA6B 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 6px 20px rgba(4, 186, 107, 0.4)',
                                }
                            }}
                        >
                            {editingSaldo ? 'ACTUALIZAR SALDO' : 'GUARDAR SALDO'}
                        </Button>
                        <Button
                            color="error"
                            variant="outlined"
                            fullWidth
                            onClick={handleClose}
                            sx={{
                                borderColor: 'rgba(239, 68, 68, 0.5)',
                                color: 'rgba(239, 68, 68, 0.8)',
                                py: 1.5,
                                '&:hover': {
                                    borderColor: '#ef4444',
                                    color: '#ef4444',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                }
                            }}
                        >
                            CANCELAR
                        </Button>
                    </Stack>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ProviderSaldosDrawer;

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse
} from '@mui/material';
import {
    AccountBalance as BankIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CreditCard as CreditCardIcon
} from '@mui/icons-material';
import { Form, Input, Select, InputNumber, notification } from 'antd';
import {
    EntidadFinancieraData,
    SaldoData,
    CuentaBancariaData
} from '@/services/saldos/saldos.service';
import {
    getProviderFinancialData,
    getTransportFinancialData,
    createProviderSaldo,
    createTransportSaldo
} from '@/services/saldos/saldos.request';
import { formatCurrency } from '@/utils/functions';
import { useAppContext } from '@/context';

interface EntityFinancialInfoProps {
    entityType: 'PROVIDER' | 'TRANSPORT';
    entityId: number;
    entityName: string;
    titleSuffix?: string;
}

const EntityFinancialInfo: React.FC<EntityFinancialInfoProps> = ({
    entityType,
    entityId,
    entityName,
    titleSuffix = ''
}) => {
    const { user } = useAppContext();
    const [financialData, setFinancialData] = useState<EntidadFinancieraData | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSaldoModal, setShowSaldoModal] = useState(false);
    const [showBankCards, setShowBankCards] = useState(false);
    const [showSaldos, setShowSaldos] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (entityId) {
            loadFinancialData();
        }
    }, [entityId, entityType]);

    const loadFinancialData = async () => {
        try {
            setLoading(true);
            let data: EntidadFinancieraData;

            if (entityType === 'PROVIDER') {
                data = await getProviderFinancialData(entityId);
            } else {
                data = await getTransportFinancialData(entityId);
            }

            setFinancialData(data);
        } catch (error) {
            console.error('Error cargando datos financieros:', error);
            // Silenciosamente manejar el error - los datos financieros son opcionales
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

            if (entityType === 'PROVIDER') {
                await createProviderSaldo(entityId, saldoData);
            } else {
                await createTransportSaldo(entityId, saldoData);
            }

            notification.success({
                message: 'Saldo creado',
                description: 'El saldo se ha creado correctamente'
            });

            setShowSaldoModal(false);
            form.resetFields();
            loadFinancialData();
        } catch (error) {
            notification.error({
                message: 'Error al crear saldo',
                description: 'No se pudo crear el saldo'
            });
        }
    };

    const getSaldoColor = () => {
        if (!financialData) return 'default';
        const { tipoSaldo } = financialData.resumenSaldo;

        switch (tipoSaldo) {
            case 'A_FAVOR': return 'success';
            case 'DEBE': return 'error';
            default: return 'default';
        }
    };

    const getSaldoIcon = () => {
        if (!financialData) return null;
        const { tipoSaldo } = financialData.resumenSaldo;

        switch (tipoSaldo) {
            case 'A_FAVOR': return <TrendingUpIcon fontSize="small" />;
            case 'DEBE': return <TrendingDownIcon fontSize="small" />;
            default: return null;
        }
    };

    const getSaldoText = () => {
        if (!financialData) return '';
        const { saldoNeto, tipoSaldo } = financialData.resumenSaldo;

        switch (tipoSaldo) {
            case 'A_FAVOR': return `Saldo a favor: ${formatCurrency(saldoNeto)}`;
            case 'DEBE': return `Deuda: ${formatCurrency(saldoNeto)}`;
            default: return 'Sin saldo';
        }
    };

    if (loading) {
        return (
            <Typography variant="caption" color="text.secondary">
                Cargando información financiera...
            </Typography>
        );
    }

    if (!financialData) {
        return null;
    }

    return (
        <Box>
            {/* Título con saldo */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {`Pagos ${entityName}${titleSuffix}`}
                </Typography>

                {financialData.resumenSaldo.tipoSaldo !== 'NEUTRO' && (
                    <Chip
                        icon={getSaldoIcon() || undefined}
                        label={getSaldoText()}
                        color={getSaldoColor()}
                        size="small"
                        variant="outlined"
                    />
                )}

                <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => setShowSaldoModal(true)}
                    sx={{ ml: 'auto' }}
                >
                    Agregar Saldo
                </Button>
            </Stack>

            {/* Información adicional expandible */}
            <Stack spacing={1}>
                {/* Cuentas bancarias */}
                {financialData.cuentasBancarias.length > 0 && (
                    <Box>
                        <Button
                            size="small"
                            startIcon={showBankCards ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            onClick={() => setShowBankCards(!showBankCards)}
                            sx={{ p: 1 }}
                        >
                            <CreditCardIcon sx={{ mr: 1 }} />
                            Cuentas Bancarias ({financialData.cuentasBancarias.length})
                        </Button>

                        <Collapse in={showBankCards}>
                            <Card variant="outlined" sx={{ mt: 1 }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Stack spacing={1}>
                                        {financialData.cuentasBancarias.map((cuenta) => (
                                            <Box key={cuenta.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <BankIcon color="primary" fontSize="small" />
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {cuenta.banco}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {cuenta.numeroCuenta}
                                                    </Typography>
                                                    {cuenta.numeroCci && (
                                                        <Typography variant="caption" color="text.secondary">
                                                            CCI: {cuenta.numeroCci}
                                                        </Typography>
                                                    )}
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
                {financialData.saldos.length > 0 && (
                    <Box>
                        <Button
                            size="small"
                            startIcon={showSaldos ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            onClick={() => setShowSaldos(!showSaldos)}
                            sx={{ p: 1 }}
                        >
                            Historial de Saldos ({financialData.saldos.length})
                        </Button>

                        <Collapse in={showSaldos}>
                            <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Tipo</TableCell>
                                            <TableCell>Monto</TableCell>
                                            <TableCell>Descripción</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {financialData.saldos.map((saldo) => (
                                            <TableRow key={saldo.id}>
                                                <TableCell>
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
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {formatCurrency(saldo.monto)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {saldo.descripcion || '-'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Collapse>
                    </Box>
                )}
            </Stack>

            {/* Modal para agregar saldo */}
            <Dialog open={showSaldoModal} onClose={() => setShowSaldoModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Agregar Saldo</DialogTitle>
                <DialogContent>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateSaldo}
                        style={{ paddingTop: 16 }}
                    >
                        <Form.Item
                            name="tipoMovimiento"
                            label="Tipo de Movimiento"
                            rules={[{ required: true, message: 'Seleccione el tipo de movimiento' }]}
                        >
                            <Select placeholder="Seleccionar tipo">
                                <Select.Option value="A_FAVOR">A Favor</Select.Option>
                                <Select.Option value="DEBE">Deuda</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="monto"
                            label="Monto"
                            rules={[{ required: true, message: 'Ingrese el monto' }]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="0.00"
                                min={0}
                                precision={2}
                                formatter={(value) => `S/ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: any) => value.replace(/S\/\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="descripcion"
                            label="Descripción (Opcional)"
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Descripción del movimiento..."
                                maxLength={255}
                            />
                        </Form.Item>
                    </Form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSaldoModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => form.submit()}
                        variant="contained"
                    >
                        Crear Saldo
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EntityFinancialInfo;

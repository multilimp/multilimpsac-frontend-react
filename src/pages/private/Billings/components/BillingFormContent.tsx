import React, { useState, useEffect, useCallback } from 'react';
import { notification, Form, Select, Button, Space } from 'antd';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { SaleProps } from '@/services/sales/sales';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import { getBillingHistoryByOrdenCompraId } from '@/services/billings/billings.request';
import { formatCurrency, formattedDate, formattedDateTime, toPickerDate } from '@/utils/functions';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { estadoOptions, ESTADOS, estadoBgMap } from '@/utils/constants';
import { getOpsByOrdenCompra } from '@/services/trackings/trackings.request';
import { printOrdenProveedor } from '@/services/print/print.requests';
import { patchSale } from '@/services/sales/sales.request';
import ProviderOrdersTableSkeleton from './ProviderOrdersTableSkeleton';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';
import { BillingProps } from '@/services/billings/billings.d';
import BillingModal, { BillingModalMode } from './BillingModal';
import BillingHistory from '@/components/BillingHistory';
import PaymentsList from '@/components/PaymentsList';

interface BillingFormContentProps {
  sale: SaleProps;
}


const BillingFormContent = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrderProps[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingProps[]>([]);

  // Estado unificado para el modal de facturación
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [billingModalMode, setBillingModalMode] = useState<BillingModalMode>('create');
  const [selectedBilling, setSelectedBilling] = useState<BillingProps | null>(null);

  const [cartaCciUrl, setCartaCciUrl] = useState<string | null>(null);
  const [cartaGarantiaUrl, setCartaGarantiaUrl] = useState<string | null>(null);
  const [savingCartaCci, setSavingCartaCci] = useState(false);
  const [savingCartaGarantia, setSavingCartaGarantia] = useState(false);

  const [estadoFacturacion, setEstadoFacturacion] = useState<string>(sale.estadoFacturacion || ESTADOS.PENDIENTE.value);

  useEffect(() => {
    loadOrdenesProveedor();
    loadBillingHistory();
  }, [sale.id]);

  useEffect(() => {
    if (sale.estadoFacturacion) {
      setEstadoFacturacion(sale.estadoFacturacion);
      form.setFieldsValue({ estadoFacturacion: sale.estadoFacturacion });
    }
  }, [sale.estadoFacturacion, form]);

  useEffect(() => {
    if (sale.cartaCci) {
      setCartaCciUrl(sale.cartaCci);
    }
    if (sale.cartaGarantia) {
      setCartaGarantiaUrl(sale.cartaGarantia);
    }
  }, [sale.cartaCci, sale.cartaGarantia]);

  const loadOrdenesProveedor = useCallback(async () => {
    try {
      setLoading(true);
      const ops = await getOpsByOrdenCompra(sale.id);

      if (ops && Array.isArray(ops)) {
        setOrdenesProveedor(ops);
      } else {
        setOrdenesProveedor([]);
      }
    } catch (error) {
      console.error('Error loading provider orders:', error instanceof Error ? error.message : 'Unknown error');
      setOrdenesProveedor([]);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar las órdenes de proveedor'
      });
    } finally {
      setLoading(false);
    }
  }, [sale.id]);

  const loadBillingHistory = useCallback(async () => {
    try {
      const history = await getBillingHistoryByOrdenCompraId(sale.id);
      setBillingHistory(history || []);
    } catch (error) {
      console.error('❌ Error loading billing history:', error instanceof Error ? error.message : 'Unknown error');
      setBillingHistory([]);
    }
  }, [sale.id]);

  // Funciones para el modal unificado de facturación
  const handleOpenCreateModal = useCallback(() => {
    setSelectedBilling(null);
    setBillingModalMode('create');
    setBillingModalOpen(true);
  }, []);

  const handleOpenRefactorModal = useCallback((billing: BillingProps) => {
    setSelectedBilling(billing);
    setBillingModalMode('refactor');
    setBillingModalOpen(true);
  }, []);

  const handleViewBilling = useCallback((billing: BillingProps) => {
    setSelectedBilling(billing);
    setBillingModalMode('view');
    setBillingModalOpen(true);
  }, []);

  const handleCloseBillingModal = useCallback(() => {
    setBillingModalOpen(false);
    setSelectedBilling(null);
  }, []);

  const handleBillingSuccess = useCallback(async () => {
    await loadBillingHistory();
  }, [loadBillingHistory]);

  const handleViewFile = useCallback((fileUrl: string | null | undefined) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }, []);

  const handleEstadoFacturacionChange = useCallback(async (value: string) => {
    try {
      setEstadoFacturacion(value);
      form.setFieldsValue({ estadoFacturacion: value });

      await patchSale(sale.id, { estadoFacturacion: value });

      notification.success({
        message: 'Estado actualizado',
        description: 'El estado de facturación se actualizó correctamente',
        duration: 2
      });
    } catch (error) {
      console.error('Error updating estado facturación:', error);
      notification.error({
        message: 'Error al actualizar',
        description: 'No se pudo actualizar el estado de facturación'
      });
      setEstadoFacturacion(sale.estadoFacturacion || ESTADOS.PENDIENTE.value);
      form.setFieldsValue({ estadoFacturacion: sale.estadoFacturacion || ESTADOS.PENDIENTE.value });
    }
  }, [sale.id, sale.estadoFacturacion, form]);

  // Guardar Carta CCI automáticamente
  const handleCartaCciChange = useCallback(async (fileUrl: string | null) => {
    setCartaCciUrl(fileUrl);

    if (fileUrl) {
      try {
        setSavingCartaCci(true);
        await patchSale(sale.id, { cartaCci: fileUrl });
        notification.success({
          message: 'Carta CCI guardada',
          description: 'El documento se ha guardado correctamente',
          duration: 2
        });
      } catch (error) {
        console.error('Error saving Carta CCI:', error);
        notification.error({
          message: 'Error al guardar',
          description: 'No se pudo guardar la Carta CCI'
        });
        setCartaCciUrl(sale.cartaCci || null);
      } finally {
        setSavingCartaCci(false);
      }
    } else if (sale.cartaCci) {
      // Si se eliminó el archivo, actualizar en BD
      try {
        setSavingCartaCci(true);
        await patchSale(sale.id, { cartaCci: null });
        notification.success({
          message: 'Carta CCI eliminada',
          description: 'El documento se ha eliminado correctamente',
          duration: 2
        });
      } catch (error) {
        console.error('Error removing Carta CCI:', error);
        notification.error({
          message: 'Error al eliminar',
          description: 'No se pudo eliminar la Carta CCI'
        });
        setCartaCciUrl(sale.cartaCci);
      } finally {
        setSavingCartaCci(false);
      }
    }
  }, [sale.id, sale.cartaCci]);

  // Guardar Carta de Garantía automáticamente
  const handleCartaGarantiaChange = useCallback(async (fileUrl: string | null) => {
    setCartaGarantiaUrl(fileUrl);

    if (fileUrl) {
      try {
        setSavingCartaGarantia(true);
        await patchSale(sale.id, { cartaGarantia: fileUrl });
        notification.success({
          message: 'Carta de Garantía guardada',
          description: 'El documento se ha guardado correctamente',
          duration: 2
        });
      } catch (error) {
        console.error('Error saving Carta Garantía:', error);
        notification.error({
          message: 'Error al guardar',
          description: 'No se pudo guardar la Carta de Garantía'
        });
        setCartaGarantiaUrl(sale.cartaGarantia || null);
      } finally {
        setSavingCartaGarantia(false);
      }
    } else if (sale.cartaGarantia) {
      // Si se eliminó el archivo, actualizar en BD
      try {
        setSavingCartaGarantia(true);
        await patchSale(sale.id, { cartaGarantia: null });
        notification.success({
          message: 'Carta de Garantía eliminada',
          description: 'El documento se ha eliminado correctamente',
          duration: 2
        });
      } catch (error) {
        console.error('Error removing Carta Garantía:', error);
        notification.error({
          message: 'Error al eliminar',
          description: 'No se pudo eliminar la Carta de Garantía'
        });
        setCartaGarantiaUrl(sale.cartaGarantia);
      } finally {
        setSavingCartaGarantia(false);
      }
    }
  }, [sale.id, sale.cartaGarantia]);

  const getLocationName = (location: any): string => {
    if (!location) return '';
    if (typeof location === 'object' && location.name) return location.name;
    if (typeof location === 'string') return location;
    return '';
  };

  const domicilioFiscal = sale?.cliente?.direccion
    ? `${sale.cliente.direccion}${sale.cliente.distrito ? ` - ${getLocationName(sale.cliente.distrito)}` : ''}${sale.cliente.provincia ? ` - ${getLocationName(sale.cliente.provincia)}` : ''}${sale.cliente.departamento ? ` - ${getLocationName(sale.cliente.departamento)}` : ''}`
    : 'No especificado';

  const handlePrintOP = async (op: ProviderOrderProps) => {
    try {
      notification.info({
        message: 'Generando PDF',
        description: `Preparando impresión de ${op.codigoOp}...`
      });

      await printOrdenProveedor(op.id);

      notification.success({
        message: 'PDF Generado',
        description: `La orden de proveedor ${op.codigoOp} se ha descargado correctamente`
      });
    } catch (error) {
      console.error('Error al imprimir OP:', error instanceof Error ? error.message : String(error));
      notification.error({
        message: 'Error al generar PDF',
        description: `No se pudo generar el PDF de ${op.codigoOp}`
      });
    }
  };
  interface BillingSectionProps {
    billingHistory: BillingProps[];
  }

  const BillingSection = React.memo<BillingSectionProps>(({ billingHistory }) => {
    return (
      <>
        {/* Apartado de Documentos */}
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h6 style={{
                fontWeight: 600,
                color: '#667eea',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: 0,
                fontSize: '1rem'
              }}>
                📄
                Documentos
              </h6>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <SimpleFileUpload
                  label="Carta CCI"
                  accept="application/pdf"
                  value={cartaCciUrl}
                  onChange={handleCartaCciChange}
                />
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <SimpleFileUpload
                  label="Carta de Garantía"
                  accept="application/pdf"
                  value={cartaGarantiaUrl}
                  onChange={handleCartaGarantiaChange}
                />
              </div>
            </div>
          </div>
        </div>

        <BillingHistory
          billings={billingHistory}
          readOnly={false}
          onCreateNew={handleOpenCreateModal}
          onRefactor={handleOpenRefactorModal}
          onView={handleViewBilling}
          onViewFile={handleViewFile}
        />
      </>
    );
  });

  const ProviderOrdersTableComponent = React.memo<{ ordenesProveedor: any[]; handlePrintOP: (op: any) => void }>(({ ordenesProveedor, handlePrintOP }) => (
    <div style={{
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#e2e8f0' }}>
            <th style={{ fontWeight: 600, color: '#475569', padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>OP</th>
            <th style={{ fontWeight: 600, color: '#475569', padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>Fecha Recepción</th>
            <th style={{ fontWeight: 600, color: '#475569', padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>Fecha Programada</th>
            <th style={{ fontWeight: 600, color: '#475569', padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>Fecha Despacho</th>
            <th style={{ fontWeight: 600, color: '#475569', padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1', minWidth: 350 }}>Nota Adicional</th>
            <th style={{ fontWeight: 600, color: '#475569', padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenesProveedor.map((op, index) => (
            <tr
              key={op.id}
              style={{
                borderBottom: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={{ color: '#475569', fontWeight: 500, padding: '0.75rem' }}>
                {op.codigoOp}
              </td>
              <td style={{ color: '#64748b', padding: '0.75rem' }}>
                {formattedDateTime(op.fechaRecepcion)}
              </td>
              <td style={{ color: '#64748b', padding: '0.75rem' }}>
                {formattedDate(op.fechaProgramada)}
              </td>
              <td style={{ color: '#64748b', padding: '0.75rem' }}>
                {formattedDate(op.fechaDespacho)}
              </td>
              <td style={{ color: '#64748b', padding: '0.75rem' }}>
                {op.notaAdicional}
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                <button
                  onClick={() => handlePrintOP(op)}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#5a67d8'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#667eea'}
                >
                  🖨️ Imprimir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ));

  return (
    <>
      {loading ? (
        <ProviderOrderFormSkeleton />
      ) : (
        <div style={{ padding: '1.5rem' }}>
          <Form form={form} layout="vertical">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Header OC - READONLY */}
              <StepItemContent
                showHeader
                color="#10b981"
                headerLeft={`Fecha creación: ${formattedDate(sale.createdAt)}`}
                headerRight={`Fecha actualización: ${formattedDate(sale.updatedAt)}`}
                showSearchButton={false}
                resumeContent={
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {sale.codigoVenta}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 300 }}>
                      {sale?.cliente?.razonSocial || 'Cliente no especificado'} - {sale?.cliente?.codigoUnidadEjecutora || ' '}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 300 }}>
                      RUC: {sale?.cliente?.ruc || ' '}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 300 }}>
                      Direccion: {sale?.cliente?.direccion || ' '}
                    </Typography>
                  </Box>
                }
                showFooter={true}
                footerContent={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      Domicilio Fiscal: {domicilioFiscal}
                    </Typography>
                  </Box>
                }
              >
                {/* Información Empresarial Minimalista */}
                <div>
                  {/* Grid minimalista - Exactamente 4 columnas */}
                  <h6 style={{
                    fontWeight: 600,
                    color: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: 0,
                    marginBottom: '1rem',
                    fontSize: '1rem'
                  }}>
                    📋
                    Información de la Orden de Compra
                  </h6>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '1.5rem'
                  }}>
                    {/* Card 1: Empresa */}
                    {sale?.empresa?.razonSocial && (
                      <div style={{
                        minHeight: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '0.25rem'
                      }}>
                        <div>
                          <p style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', margin: 0, color: '#666' }}>
                            Empresa
                          </p>
                          <p style={{
                            fontWeight: 500,
                            color: '#424242',
                            fontSize: '0.9rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            margin: 0
                          }}>
                            {sale.empresa.razonSocial}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card 2: Fecha Emisión */}
                    {sale.fechaEmision && (
                      <div style={{
                        minHeight: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: 'none',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '0.25rem'
                      }}>
                        <div>
                          <p style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', margin: 0, color: '#666' }}>
                            Fecha Emisión
                          </p>
                          <p style={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem', margin: 0 }}>
                            {formattedDate(sale.fechaEmision)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Card 3: Monto Total */}
                    <div style={{
                      minHeight: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'none',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '0.25rem'
                    }}>
                      <div>
                        <p style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', margin: 0, color: '#666' }}>
                          Monto Total
                        </p>
                        <p style={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem', margin: 0 }}>
                          {formatCurrency(parseFloat(sale.montoVenta || '0'))}
                        </p>
                      </div>
                    </div>

                    {/* Card 4: Fuente de financiamiento */}
                    <div style={{
                      minHeight: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'none',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '0.25rem'
                    }}>
                      <div>
                        <p style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', margin: 0, color: '#666' }}>
                          Fuente de Financiamiento
                        </p>
                        <p style={{
                          fontWeight: 500,
                          color: '#424242',
                          fontSize: '0.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          margin: 0
                        }}>
                          {sale.multipleFuentesFinanciamiento ? 'Múltiples fuentes' : 'Única fuente'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StepItemContent>

              {/* Tabla de Órdenes de Proveedor - READONLY */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h6 style={{
                      fontWeight: 600,
                      color: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      margin: 0,
                      fontSize: '1rem'
                    }}>
                      📋
                      Órdenes de Proveedor
                    </h6>
                  </div>

                  {loading ? (
                    <ProviderOrdersTableSkeleton />
                  ) : ordenesProveedor.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '2px dashed #e2e8f0'
                    }}>
                      <div style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }}>📋</div>
                      <h6 style={{ color: '#64748b', marginBottom: '0.5rem', margin: 0 }}>
                        No hay órdenes de proveedor
                      </h6>
                      <p style={{ color: '#94a3b8', marginBottom: '1.5rem', margin: 0 }}>
                        No se encontraron órdenes de proveedor registradas para esta orden de compra
                      </p>
                    </div>
                  ) : (
                    <ProviderOrdersTableComponent
                      ordenesProveedor={ordenesProveedor}
                      handlePrintOP={handlePrintOP}
                    />
                  )}
                </div>
              </div>

              {/* Sección de Pagos de Venta Privada */}
              {sale.ventaPrivada && sale.ordenCompraPrivada?.pagos && (
                <div style={{ marginTop: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <PaymentsList
                    payments={sale.ordenCompraPrivada.pagos.map(p => ({
                      date: toPickerDate(p.fechaPago),
                      bank: p.bancoPago,
                      description: p.descripcionPago,
                      file: p.archivoPago || null,
                      amount: p.montoPago.toString(),
                      status: p.estadoPago
                    }))}
                    title="Pagos de Venta Privada"
                    mode="readonly"
                    montoTotal={parseFloat(sale.montoVenta || '0')}
                  />
                </div>
              )}
              <BillingSection
                billingHistory={billingHistory}
              />
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <button
                  onClick={() => navigate('/billing')}
                  style={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 600,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                    border: '2px solid #667eea',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#5a67d8';
                    e.currentTarget.style.backgroundColor = 'rgba(102, 94, 234, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  ← Regresar a Facturaciones
                </button>

                <div style={{ minWidth: 280 }}>
                  <p style={{
                    color: '#475569',
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: 0
                  }}>
                    Estado de Facturación
                  </p>
                  <Form.Item
                    name="estadoFacturacion"
                    initialValue={sale.estadoFacturacion || ESTADOS.PENDIENTE.value}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      value={estadoFacturacion}
                      onChange={handleEstadoFacturacionChange}
                      placeholder="Seleccionar estado"
                      size="large"
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                      dropdownStyle={{
                        borderRadius: 12,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        fontSize: 15,
                      }}
                    >
                      {estadoOptions.map(option => (
                        <Select.Option
                          key={option.value}
                          value={option.value}
                          style={{
                            color: estadoBgMap[option.value] || '#222',
                            fontWeight: 600,
                            padding: '10px 16px',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: estadoBgMap[option.value] || '#ccc',
                                boxShadow: `0 0 8px ${estadoBgMap[option.value]}60`
                              }}
                            />
                            <span>{option.label}</span>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
            </div>

            {/* Modal unificado de facturación */}
            <BillingModal
              open={billingModalOpen}
              mode={billingModalMode}
              billing={selectedBilling}
              ordenCompraId={sale.id}
              onClose={handleCloseBillingModal}
              onSuccess={handleBillingSuccess}
            />
          </Form>
        </div>
      )}
    </>
  );
};

export default BillingFormContent;
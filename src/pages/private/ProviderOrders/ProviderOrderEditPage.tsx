import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import PageContent from '@/components/PageContent';
import { SaleProps } from '@/services/sales/sales';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { getOrderProviderById } from '@/services/providerOrders/providerOrders.requests';
import ProviderOrderFormContent from './components/ProviderOrderFormContent';
import { Button } from '@mui/material';

const ProviderOrderEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<ProviderOrderProps | null>(null);
  const [saleData, setSaleData] = useState<SaleProps | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const data = await getOrderProviderById(parseInt(id!));
      setOrderData(data);
      
      // Crear datos de venta usando la información de la OC si está disponible
      setSaleData({
        id: data.ordenCompraId || 0,
        codigoVenta: data.ordenCompra?.codigoVenta || '',
        fechaEmision: data.ordenCompra?.fechaEmision || '',
        empresaId: data.empresaId || data.ordenCompra?.empresaId || 0,
        clienteId: data.ordenCompra?.clienteId || 0,
        contactoClienteId: data.ordenCompra?.contactoClienteId || 0,
        catalogoEmpresaId: 0, // Campo no disponible en la respuesta
        departamentoEntrega: data.ordenCompra?.departamentoEntrega || '',
        provinciaEntrega: data.ordenCompra?.provinciaEntrega || '',
        distritoEntrega: data.ordenCompra?.distritoEntrega || '',
        direccionEntrega: data.ordenCompra?.direccionEntrega || '',
        referenciaEntrega: data.ordenCompra?.referenciaEntrega || '',
        fechaForm: '',
        fechaMaxForm: '',
        montoVenta: '',
        etapaActual: '',
        etapaSiaf: '',
        siaf: '',
        // Agregar otros campos necesarios como valores por defecto
      } as unknown as SaleProps);
    } catch (error) {
      notification.error({ message: 'Error al cargar la orden de proveedor' });
      navigate('/provider-orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContent
        title="Cargando Orden de Proveedor..."
        helper="ÓRDENES / PROVEEDOR / EDITAR"
      >
        <div>Cargando...</div>
      </PageContent>
    );
  }

  if (!orderData || !saleData) {
    return (
      <PageContent
        title="Orden de Proveedor No Encontrada"
        helper="ÓRDENES / PROVEEDOR / EDITAR"
        component={
          <Button variant="outlined" onClick={() => navigate('/provider-orders')}>
            ← Volver a Órdenes
          </Button>
        }
      >
        <div>No se pudo cargar la información de la orden de proveedor.</div>
      </PageContent>
    );
  }

  return (
    <PageContent
      title={`Editar Orden Proveedor - ${orderData.codigoOp}`}
      helper="ÓRDENES / PROVEEDOR / EDITAR"
      component={
        <Button variant="outlined" onClick={() => navigate('/provider-orders')}>
          ← Volver a Órdenes
        </Button>
      }
    >
      <ProviderOrderFormContent 
        sale={saleData} 
        orderData={orderData}
        isEditing={true}
      />
    </PageContent>
  );
};

export default ProviderOrderEditPage;

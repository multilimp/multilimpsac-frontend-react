import { useState, useEffect } from 'react';
import PageContent from '@/components/PageContent';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { getAllOrderProviders } from '@/services/providerOrders/providerOrders.requests';
import OpTable from '../ProviderOrders/components/OpTable';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Button, DatePicker, Space } from 'antd';
import { Box } from '@mui/material';
import { FilePdfOutlined } from '@ant-design/icons';
import { generateCargosEntregaPDF } from '@/services/print/print.requests';
import dayjs from 'dayjs';

const OpTables = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ops, setOps] = useState<Array<ProviderOrderProps>>([]);
  const [fechaInicio, setFechaInicio] = useState<dayjs.Dayjs | null>(null);
  const [fechaFin, setFechaFin] = useState<dayjs.Dayjs | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const loadOps = async () => {
    try {
      setLoading(true);
      const data = await getAllOrderProviders();
      setOps(data);
    } catch (error) {
      console.error('Error loading OPs:', error);
      notification.error({
        message: 'Error al cargar datos',
        description: 'No se pudieron cargar las órdenes de proveedor'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOps();
  }, []);

  const handleRowClick = (op: ProviderOrderProps) => {
    navigate(`/provider-orders/${op.id}`);
  };

  const handleGenerateCargosEntregaPDF = async () => {
    if (!fechaInicio || !fechaFin) {
      notification.error({
        message: 'Fechas requeridas',
        description: 'Por favor selecciona fecha de inicio y fecha fin'
      });
      return;
    }

    try {
      setGeneratingPDF(true);
      await generateCargosEntregaPDF(
        fechaInicio.format('YYYY-MM-DD'),
        fechaFin.format('YYYY-MM-DD')
      );
      notification.success({
        message: 'PDF generado',
        description: 'El reporte de cargos de entrega se ha descargado correctamente'
      });
    } catch (error) {
      console.error('Error generando PDF:', error);
      notification.error({
        message: 'Error al generar PDF',
        description: 'No se pudo generar el reporte de cargos de entrega'
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <PageContent>
      <Box sx={{ mb: 3 }}>
        <Space direction="vertical" size="middle">
          <Box>
            <h2>Reporte de Cargos de Entrega</h2>
            <Space>
              <DatePicker
                placeholder="Fecha Inicio"
                value={fechaInicio}
                onChange={setFechaInicio}
                format="DD/MM/YYYY"
              />
              <DatePicker
                placeholder="Fecha Fin"
                value={fechaFin}
                onChange={setFechaFin}
                format="DD/MM/YYYY"
              />
              <Button
                type="primary"
                icon={<FilePdfOutlined />}
                loading={generatingPDF}
                onClick={handleGenerateCargosEntregaPDF}
                disabled={!fechaInicio || !fechaFin}
              >
                Generar Reporte PDF
              </Button>
            </Space>
          </Box>
        </Space>
      </Box>

      <OpTable
        loading={loading}
        data={ops}
        onRowClick={handleRowClick}
        onReload={loadOps}
      />
    </PageContent>
  );
};

export default OpTables;

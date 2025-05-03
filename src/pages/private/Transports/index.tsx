import PageContent from '@/components/PageContent';
import TransportsTable from './components/TransportsTable';
import TransportModal from './components/TransportsModal';
import { Button } from 'antd';
import { TransportProps } from '@/services/transports/transports';
import { getTransports, createTransport, updateTransport, deleteTransport } from '@/services/transports/transports.request';
import { notification } from 'antd';
import { useState, useEffect } from 'react';

const TransportsPage = () => {
  const [loading, setLoading] = useState(false);
  const [transports, setTransports] = useState<TransportProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTransport, setCurrentTransport] = useState<TransportProps | null>(null);

  const fetchTransports = async () => {
    try {
      setLoading(true);
      const data = await getTransports();
      setTransports(data);
    } catch (error) {
      notification.error({
        message: 'Error al obtener transportes',
        description: 'No se pudieron cargar los transportes',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  const handleCreate = () => {
    setCurrentTransport(null);
    setModalVisible(true);
  };

  const handleSave = async (values: TransportProps) => {
    try {
      if (values.id) {
        await updateTransport(values.id, values);
        notification.success({
          message: 'Transporte actualizado',
          description: `${values.socialReason} fue actualizado correctamente`,
        });
      } else {
        await createTransport(values);
        notification.success({
          message: 'Transporte creado',
          description: `${values.socialReason} fue registrado correctamente`,
        });
      }
      fetchTransports();
      setModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo guardar el transporte',
      });
    }
  };

  return (
    <PageContent
      title="Transportes"
      helper="DIRECTORIO / TRANSPORTES"
      component={
        <Button type="primary" onClick={handleCreate}>
          Nuevo Transporte
        </Button>
      }
    >
      <TransportsTable
        data={transports}
        loading={loading}
        onEdit={(transport) => {
          setCurrentTransport(transport);
          setModalVisible(true);
        }}
        onDelete={async (transport) => {
          try {
            await deleteTransport(transport.id);
            notification.success({
              message: 'Transporte eliminado',
              description: `${transport.socialReason} fue eliminado correctamente`,
            });
            fetchTransports();
          } catch (error) {
            notification.error({
              message: 'Error al eliminar',
              description: 'No se pudo eliminar el transporte',
            });
          }
        }}
      />

      <TransportModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        transport={currentTransport}
      />
    </PageContent>
  );
};

export default TransportsPage;
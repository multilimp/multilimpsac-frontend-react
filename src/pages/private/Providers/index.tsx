import PageContent from '@/components/PageContent';
import ProvidersTable from './components/ProvidersTable';
import { useEffect, useState } from 'react';
import { ProviderProps } from '@/services/providers/providers';
import { notification } from 'antd';
import { getProviders } from '@/services/providers/providers.request';
import { Button } from '@mui/material';
import ProviderModal from './components/ProvidersModal';
import { ModalStateEnum } from '@/types/global.enum';

type ModalStateType = {
  mode: ModalStateEnum;
  data: ProviderProps | null;
} | null;

const ProvidersPage = () => {
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<ProviderProps[]>([]);
  const [modalState, setModalState] = useState<ModalStateType>(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await getProviders();
      setProviders(response);
    } catch (error) {
      notification.error({
        message: 'Error al obtener proveedores',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleOpenModal = (provider?: ProviderProps) => {
    setModalState({
      mode: ModalStateEnum.BOX,
      data: provider || null
    });
  };

  const handleCloseModal = () => {
    setModalState(null);
    fetchProviders();
  };

  const handleSuccess = () => {
    fetchProviders();
  };

  return (
    <PageContent
      title="Proveedores"
      helper="DIRECTORIO / PROVEEDORES"
      component={
        <Button 
          variant="contained" 
          onClick={() => handleOpenModal()}
        >
          Agregar Proveedor
        </Button>
      }
    >
      <ProvidersTable 
        data={providers} 
        loading={loading}
        onEdit={(provider) => handleOpenModal(provider)}
        onDelete={(provider) => {
          notification.success({
            message: 'Proveedor eliminado',
            description: `Se eliminó a ${provider.socialReason}`
          });
          fetchProviders();
        }}
      />
      
      {modalState?.mode === ModalStateEnum.BOX && (
        <ProviderModal
          visible={true}
          onCancel={handleCloseModal}
          onSuccess={handleSuccess}
          provider={modalState.data} // Pasamos la prop correcta "provider" en lugar de "data"
        />
      )}
    </PageContent>
  );
};

export default ProvidersPage;
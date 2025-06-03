import { useState } from 'react';
import InputAntd from '@/components/InputAntd';
import useCatalogs from '@/hooks/useCatalogs';
import { CatalogProps } from '@/services/catalogs/catalogs';
import { CompanyProps } from '@/services/companies/company';
import { AddBox, Close, Delete, Edit } from '@mui/icons-material';
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { Empty, Form, message, Spin } from 'antd';
import { createCatalog, deleteCatalog, updateCatalog } from '@/services/catalogs/catalogs.requests';

interface CompanyCatalogDrawerProps {
  handleClose: VoidFunction;
  data: CompanyProps;
}

const CompanyCatalogDrawer = ({ data, handleClose }: CompanyCatalogDrawerProps) => {
  const { catalogs, loadingCatalogs, obtainCatalogs } = useCatalogs(data.id);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState<{ open: boolean; data?: CatalogProps }>({ open: false });
  const isLoading = loading || loadingCatalogs;

  const onDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteCatalog(id);
      obtainCatalogs();
    } catch (error) {
      message.error(`No se logró eliminar el catálogo. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const closeForm = () => setOpenForm({ open: false });

  return (
    <Drawer anchor="right" open onClose={handleClose}>
      <Box sx={{ borderRadius: 0, width: { xs: '100%', sm: 400 } }}>
        <CardHeader
          title="CATÁLOGOS"
          subheader={data.razonSocial}
          slotProps={{ title: { fontWeight: 700, fontSize: 20 } }}
          sx={{ pt: 2 }}
          action={
            <IconButton size="small" color="error" onClick={handleClose} disabled={isLoading}>
              <Close fontSize="large" />
            </IconButton>
          }
        />
        <CardContent sx={{ height: 'calc((100vh) - 225px)', overflow: 'auto', pt: 0.1 }}>
          <Spin spinning={isLoading}>
            <Stack direction="column" spacing={2}>
              {catalogs.length ? (
                catalogs.map((item) => (
                  <Card key={item.id}>
                    <CardHeader
                      title={item.nombre}
                      sx={{ pt: 2 }}
                      avatar={
                        <IconButton color="info" onClick={() => setOpenForm({ open: true, data: item })}>
                          <Edit />
                        </IconButton>
                      }
                      action={
                        <IconButton color="error" onClick={() => onDelete(item.id)}>
                          <Delete />
                        </IconButton>
                      }
                    />
                    <CardContent sx={{ pt: 0, pb: '16px !important' }}>
                      <Typography flex={1} color="textSecondary" variant="body2">
                        {item.descripcion}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Empty description="No hay catálogos" />
              )}

              {openForm.open ? (
                <CardForm onClose={closeForm} record={openForm.data} empresaId={data.id} onReload={obtainCatalogs} />
              ) : (
                <Card>
                  <CardActionArea onClick={() => setOpenForm({ open: true })}>
                    <CardContent>
                      <Stack direction="column" justifyContent="center" alignItems="center">
                        <AddBox fontSize="large" color="info" />
                        <Typography variant="subtitle1" color="info">
                          Agregar catálogo
                        </Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              )}
            </Stack>
          </Spin>
        </CardContent>
      </Box>
    </Drawer>
  );
};

export default CompanyCatalogDrawer;

interface CardFormProps {
  onClose: VoidFunction;
  onReload: VoidFunction;
  record?: CatalogProps;
  empresaId: number;
}
const CardForm = ({ record, empresaId, onClose, onReload }: CardFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      setLoading(true);

      if (record) {
        await updateCatalog(record.id, values);
      } else {
        await createCatalog({ ...values, empresaId });
      }

      onClose();
      onReload();
    } catch (error) {
      message.error(`No se logró guardar el catálogo. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            nombre: record?.nombre,
            descripcion: record?.descripcion,
          }}
        >
          <Form.Item name="nombre" rules={[{ required: true, message: 'El nombre es requerido' }]}>
            <InputAntd label="Nombre" disabled={loading} />
          </Form.Item>
          <Form.Item name="descripcion">
            <InputAntd label="Descripción" type="textarea" disabled={loading} />
          </Form.Item>

          <Stack direction="column" spacing={2} mt={4}>
            <Button fullWidth type="submit" loading={loading}>
              GUARDAR{record ? ' CAMBIOS' : ''}
            </Button>
            <Button color="error" variant="outlined" fullWidth onClick={onClose} disabled={loading}>
              CANCELAR
            </Button>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  );
};

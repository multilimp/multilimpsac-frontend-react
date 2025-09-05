import { useState } from 'react';
import InputAntd from '@/components/InputAntd';
import useCatalogs from '@/hooks/useCatalogs';
import { CatalogProps } from '@/services/catalogs/catalogs';
import { CompanyProps } from '@/services/companies/company';
import { AddBox, Close, Delete, Edit } from '@mui/icons-material';
import { Box, Button, Card, CardActionArea, CardContent, CardHeader, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { Empty, Form, message, Skeleton } from 'antd';
import { createCatalog, deleteCatalog, updateCatalog } from '@/services/catalogs/catalogs.requests';

interface CompanyCatalogDrawerProps {
  handleClose: VoidFunction;
  data: CompanyProps;
}

const CompanyCatalogDrawer = ({ data, handleClose }: CompanyCatalogDrawerProps) => {
  console.log('🎨 CompanyCatalogDrawer rendered with data:', data);

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
    <Drawer
      anchor="right"
      open
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          background: '#0f1a2b',
          color: 'white',
        }
      }}
    >
      <Box sx={{ borderRadius: 0, width: { xs: '100%', sm: 400 } }}>
        <Box
          sx={{
            background: 'rgba(15, 26, 43, 0.9)',
            color: 'white',
            p: 3,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <AddBox sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                  CATÁLOGOS
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {data.razonSocial}
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={handleClose}
              disabled={isLoading}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Close fontSize="large" />
            </IconButton>
          </Stack>
        </Box>
        <Box sx={{
          height: 'calc(100vh - 120px)',
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(4, 186, 107, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#04BA6B',
            borderRadius: '4px',
          },
        }}>
          {isLoading ? (
            <Stack direction="column" spacing={2}>
              {[1, 2].map((index) => (
                <Card
                  key={index}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Skeleton
                      active
                      title={{ width: '60%' }}
                      paragraph={{ rows: 2, width: ['80%', '40%'] }}
                      avatar={{ size: 'default', shape: 'circle' }}
                    />
                  </CardContent>
                </Card>
              ))}

              {/* Skeleton para el botón de agregar */}
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px dashed rgba(255, 255, 255, 0.3)',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ py: 3 }}>
                  <Skeleton
                    active
                    title={false}
                    paragraph={{ rows: 3, width: ['30%', '60%', '40%'] }}
                    style={{ textAlign: 'center' }}
                  />
                </CardContent>
              </Card>
            </Stack>
          ) : (
            <Stack direction="column" spacing={2}>
              {catalogs.length ? (
                catalogs.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        background: 'rgba(255, 255, 255, 1)',
                      }
                    }}
                  >
                    <CardHeader
                      title={item.nombre}
                      sx={{
                        pt: 2,
                        '& .MuiCardHeader-title': {
                          color: '#161e2a',
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }
                      }}
                      avatar={
                        <IconButton
                          onClick={() => setOpenForm({ open: true, data: item })}
                          sx={{
                            color: '#161e2a',
                            backgroundColor: 'rgba(22, 30, 42, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(22, 30, 42, 0.2)',
                            }
                          }}
                        >
                          <Edit />
                        </IconButton>
                      }
                      action={
                        <IconButton
                          onClick={() => onDelete(item.id)}
                          sx={{
                            color: '#d32f2f',
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            '&:hover': {
                              backgroundColor: 'rgba(211, 47, 47, 0.2)',
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      }
                    />
                    <CardContent sx={{ pt: 0, pb: '16px !important' }}>
                      <Typography
                        flex={1}
                        variant="body2"
                        sx={{
                          color: 'rgba(22, 30, 42, 0.8)',
                          lineHeight: 1.5
                        }}
                      >
                        {item.descripcion}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    No hay catálogos disponibles
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Agrega el primer catálogo para comenzar
                  </Typography>
                </Box>
              )}

              {openForm.open ? (
                <CardForm onClose={closeForm} record={openForm.data} empresaId={data.id} onReload={obtainCatalogs} />
              ) : (
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '2px dashed rgba(255, 255, 255, 0.3)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <CardActionArea
                    onClick={() => setOpenForm({ open: true })}
                    sx={{
                      py: 3,
                      '&:hover .MuiCardActionArea-focusHighlight': {
                        opacity: 0.1
                      }
                    }}
                  >
                    <CardContent>
                      <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
                        <AddBox
                          fontSize="large"
                          sx={{
                            color: 'white',
                            fontSize: '3rem',
                            opacity: 0.9
                          }}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: 'white',
                            fontWeight: 500,
                            fontSize: '1.1rem'
                          }}
                        >
                          Agregar catálogo
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.85rem'
                          }}
                        >
                          Haz clic para crear un nuevo catálogo
                        </Typography>
                      </Stack>
                    </CardContent>
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
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: '#161e2a',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          {record ? 'Editar Catálogo' : 'Nuevo Catálogo'}
        </Typography>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            nombre: record?.nombre,
            descripcion: record?.descripcion,
          }}
        >
          <Form.Item
            name="nombre"
            rules={[{ required: true, message: 'El nombre es requerido' }]}
            style={{ marginBottom: 20 }}
          >
            <InputAntd label="Nombre" disabled={loading} />
          </Form.Item>

          <Form.Item name="descripcion" style={{ marginBottom: 30 }}>
            <InputAntd label="Descripción" type="textarea" disabled={loading} />
          </Form.Item>

          <Stack direction="column" spacing={2}>
            <Button
              fullWidth
              type="submit"
              loading={loading}
              sx={{
                backgroundColor: '#161e2a',
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#1e2936',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(22, 30, 42, 0.3)'
                },
                '&:active': {
                  transform: 'translateY(0)',
                }
              }}
            >
              GUARDAR{record ? ' CAMBIOS' : ''}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
              disabled={loading}
              sx={{
                borderColor: 'rgba(22, 30, 42, 0.5)',
                color: '#161e2a',
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#161e2a',
                  backgroundColor: 'rgba(22, 30, 42, 0.05)',
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

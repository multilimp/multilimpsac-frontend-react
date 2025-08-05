import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { getOrderProvidersByOC } from '@/services/providerOrders/providerOrders.requests';
import { SaleProps } from '@/services/sales/sales';
import { heroUIColors, alpha } from '@/styles/theme/heroui-colors';
import { Delete, RemoveRedEye, Add, Close, Inventory2, ShoppingCart, Update } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, Drawer, Stack, Box, Typography, IconButton, Chip, Divider, Skeleton } from '@mui/material';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface ProviderOrdersListDrawerProps {
  handleClose: VoidFunction;
  data: SaleProps;
}

const ProviderOrdersListDrawer = ({ handleClose, data }: ProviderOrdersListDrawerProps) => {
  const { setSelectedSale } = useGlobalInformation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderProvidersCodes, setOrderProvidersCodes] = useState<Array<{
    id: number;
    codigoOp: string;
    createdAt: string;
    updatedAt: string;
  }>>([]);

  useEffect(() => {
    // Limpiar estado anterior cuando se abre el drawer con nueva data
    setOrderProvidersCodes([]);
    handleGetData();
  }, [data.id]); // Dependencia en data.id para resetear cuando cambie la venta

  const handleSelected = (id?: number) => {
    if (!id) {
      // Crear nueva OP
      setSelectedSale(data);
      navigate('/provider-orders/create');
    } else {
      // Ver detalle de OP existente - navegar a la nueva ruta
      navigate(`/provider-orders/${id}`);
    }
  };

  const handleGetData = async () => {
    try {
      setLoading(true);
      const res = await getOrderProvidersByOC(data.id);
      setOrderProvidersCodes([...res]);
    } catch (error) {
      notification.error({ message: 'No se logró obtener la información' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          background: '#101827',
          color: '#ffffff',
          width: { xs: '100vw', sm: 450 },
          height: '100vh',
          border: 'none',
          boxShadow: heroUIColors.shadows.xl,
        }
      }}
    >
      {/* Header sin efectos glass */}
      <Box
        sx={{
          background: heroUIColors.gradients.primary,
          color: 'white',
          p: 3,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: heroUIColors.radius.lg,
                  background: alpha('#ffffff', 0.15),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha('#ffffff', 0.2)}`,
                }}
              >
                <Inventory2 sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} letterSpacing='-0.02em'>
                  Órdenes de Proveedor
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Gestión integral de OPs
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={handleClose}
              sx={{
                color: 'white',
                background: alpha('#ffffff', 0.15),
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                borderRadius: heroUIColors.radius.md,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                '&:hover': {
                  background: alpha('#ffffff', 0.25),
                  transform: 'scale(1.05) rotate(90deg)',
                }
              }}
            >
              <Close />
            </IconButton>
          </Stack>

          {/* Info de la OC sin efectos glass */}
          <Box
            sx={{
              background: alpha('#ffffff', 0.12),
              borderRadius: heroUIColors.radius.lg,
              p: 2,
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: heroUIColors.radius.md,
                  background: alpha('#ffffff', 0.15),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCart sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Orden de Compra
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {data.codigoVenta}
                </Typography>
              </Box>
              <Chip
                label={`${orderProvidersCodes.length} OPs`}
                size="small"
                sx={{
                  background: alpha('#ffffff', 0.15),
                  color: 'white',
                  fontWeight: 700,
                  border: `1px solid ${alpha('#ffffff', 0.25)}`,
                  borderRadius: heroUIColors.radius.md,
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>



      {/* Contenido principal - Flex para ocupar el espacio restante */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 3,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: alpha('#ffffff', 0.1),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#1890ff',
              borderRadius: '4px',
              '&:hover': {
                background: '#047856',
              }
            },
          }}
        >

          {loading ? (
            <Stack direction="column" spacing={3}>
              {[1, 2].map((i) => (
                <Card
                  key={i}
                  sx={{
                    background: alpha('#ffffff', 0.08), // ✅ Cambio para fondo oscuro
                    borderRadius: heroUIColors.radius.xl,
                    boxShadow: heroUIColors.shadows.md,
                    p: 2,
                    border: `1px solid ${alpha('#ffffff', 0.1)}`, // ✅ Agregado borde sutil
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={60}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: alpha('#ffffff', 0.12), // ✅ Color base para fondo oscuro
                      '&::after': {
                        background: `linear-gradient(90deg, 
                                    transparent, 
                                    ${alpha('#1890ff', 0.2)}, 
                                    transparent)`, // ✅ Animación azul sutil
                      }
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    sx={{
                      backgroundColor: alpha('#ffffff', 0.1),
                      mb: 1,
                      height: 20,
                      '&::after': {
                        background: `linear-gradient(90deg, 
                                    transparent, 
                                    ${alpha('#1890ff', 0.15)}, 
                                    transparent)`,
                      }
                    }}
                  />
                  <Skeleton
                    variant="text"
                    width="40%"
                    sx={{
                      backgroundColor: alpha('#ffffff', 0.1),
                      height: 16,
                      '&::after': {
                        background: `linear-gradient(90deg, 
                                    transparent, 
                                    ${alpha('#1890ff', 0.15)}, 
                                    transparent)`,
                      }
                    }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={36}
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: alpha('#ffffff', 0.08),
                      '&::after': {
                        background: `linear-gradient(90deg, 
                                    transparent, 
                                    ${alpha('#1890ff', 0.2)}, 
                                    transparent)`,
                      }
                    }}
                  />
                </Card>
              ))}
            </Stack>
          ) : orderProvidersCodes.length ? (
            // ...existing code...
            <Stack direction="column" spacing={3}>
              {orderProvidersCodes.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(8px)',
                    border: `2px solid ${alpha(heroUIColors.secondary[500], 0.13)}`,
                    borderRadius: heroUIColors.radius.xl,
                    boxShadow: heroUIColors.shadows.md,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  elevation={0}
                >
                  <CardHeader
                    title={
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color={heroUIColors.secondary[500]}
                        letterSpacing="-0.01em"
                      >
                        {item.codigoOp}
                      </Typography>
                    }
                    // ✅ Subheader con fecha de modificación de la OP
                    subheader={
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: alpha('#1890ff', 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${alpha('#1890ff', 0.25)}`,
                          }}
                        >
                          <Update sx={{ fontSize: 14, color: '#1890ff' }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.6), textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Última modificación OP
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ color: alpha('#ffffff', 0.9) }}>
                            {item.updatedAt ? dayjs(item.updatedAt).format('DD/MM/YYYY - HH:mm') : 'No disponible'}
                          </Typography>
                        </Box>
                      </Stack>
                    }
                    sx={{ pb: 1 }}
                  />

                  <Divider sx={{ borderColor: alpha(heroUIColors.secondary[500], 0.1) }} />

                  <CardActions sx={{ p: 2.5, gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<RemoveRedEye />}
                      onClick={() => handleSelected(item.id)}
                      sx={{
                        background: heroUIColors.secondary[600],
                        fontWeight: 600,
                        borderRadius: heroUIColors.radius.lg,
                        textTransform: 'none',
                        py: 1.5,
                        fontSize: '0.95rem',
                        boxShadow: heroUIColors.shadows.md,

                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: heroUIColors.shadows.lg,
                          background: heroUIColors.gradients.secondary,
                        }
                      }}
                    >
                      Ver Detalle
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      sx={{
                        py: 1.5,
                      }}
                    >
                      Eliminar
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                p: 4,
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, 
                      ${alpha('#ffffff', 0.1)} 0%, 
                      ${alpha('#ffffff', 0.05)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  border: `3px solid ${alpha('#ffffff', 0.2)}`,
                  position: 'relative',

                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    right: '-10px',
                    bottom: '-10px',
                    borderRadius: '50%',
                    border: `1px solid ${alpha('#ffffff', 0.1)}`,
                    animation: 'pulse 2s infinite',
                  }
                }}
              >
                <Inventory2 sx={{ fontSize: 48, color: alpha('#ffffff', 0.7) }} />
              </Box>

              <Typography
                variant="h5"
                color="#ffffff"
                fontWeight={700}
                mb={2}
                letterSpacing='-0.02em'
              >
                Sin órdenes de proveedor
              </Typography>

              <Typography
                variant="body1"
                color={alpha('#ffffff', 0.8)}
                maxWidth={320}
                lineHeight={1.6}
                mb={3}
              >
                No hay órdenes de proveedor asociadas a esta orden de compra. Agrega una nueva OP para comenzar el proceso.
              </Typography>

              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => handleSelected()}
                sx={{
                  borderColor: alpha('#ffffff', 0.3),
                  color: '#ffffff',
                  borderRadius: heroUIColors.radius.lg,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,

                  '&:hover': {
                    borderColor: '#ffffff',
                    background: alpha('#ffffff', 0.1),
                    color: '#ffffff',
                  }
                }}
              >
                Crear Primera OP
              </Button>
            </Box>
          )}
        </CardContent>

        {/* Footer con botones de acción - Flexshrink 0 para mantener tamaño */}
        <Box
          sx={{
            p: 3,
            background: alpha('#101827', 0.9),
            borderTop: `1px solid ${alpha('#ffffff', 0.1)}`,
            flexShrink: 0,
          }}
        >
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => handleSelected()}
              sx={{
                background: '#05a867',
                fontWeight: 600,
                borderRadius: heroUIColors.radius.md,
                textTransform: 'none',
                py: 1.5,
                fontSize: '0.95rem',
                boxShadow: heroUIColors.shadows.md,
                border: `1px solid ${alpha('#ffffff', 0.2)}`,

                '&:hover': {
                  background: '#047856',
                  transform: 'translateY(-2px)',
                  boxShadow: heroUIColors.shadows.lg,
                }
              }}
            >
              Agregar Nueva OP
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleClose}
              sx={{
                borderColor: alpha('#ffffff', 0.3),
                color: '#ffffff',
                borderRadius: heroUIColors.radius.md,
                textTransform: 'none',
                py: 1.5,
                fontSize: '0.95rem',
                fontWeight: 500,

                '&:hover': {
                  borderColor: alpha('#ffffff', 0.5),
                  background: alpha('#ffffff', 0.1),
                  color: '#ffffff',
                }
              }}
            >
              Cerrar
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ProviderOrdersListDrawer;

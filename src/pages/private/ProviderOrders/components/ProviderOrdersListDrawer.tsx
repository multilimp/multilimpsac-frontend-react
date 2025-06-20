import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { getOrderProvidersByOC } from '@/services/providerOrders/providerOrders.requests';
import { SaleProps } from '@/services/sales/sales';
import { heroUIColors, alpha } from '@/styles/theme/heroui-colors';
import { Delete, RemoveRedEye, Add, Close, Inventory2, ShoppingCart } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, Drawer, Stack, Box, Typography, IconButton, Chip, Divider } from '@mui/material';
import { Empty, notification, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProviderOrdersListDrawerProps {
  handleClose: VoidFunction;
  data: SaleProps;
}

const ProviderOrdersListDrawer = ({ handleClose, data }: ProviderOrdersListDrawerProps) => {
  const { setSelectedSale } = useGlobalInformation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderProvidersCodes, setOrderProvidersCodes] = useState<Array<{ id: number; codigoOp: string }>>([]);

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
      {/* Header con color primario sólido */}
      <Box
        sx={{
          background: '#05a867',
          color: 'white',
          p: 3,
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: heroUIColors.radius.md,
                  background: alpha('#ffffff', 0.2),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#ffffff', 0.3)}`,
                }}
              >
                <Inventory2 sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} letterSpacing='-0.02em'>
                  Órdenes de Proveedor
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Gestión de OPs
                </Typography>
              </Box>
            </Stack>
            
            <IconButton 
              onClick={handleClose} 
              sx={{ 
                color: 'white',
                background: alpha('#ffffff', 0.15),
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                '&:hover': {
                  background: alpha('#ffffff', 0.25),
                  transform: 'scale(1.05)',
                }
              }}
            >
              <Close />
            </IconButton>
          </Stack>

          {/* Info de la OC */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <ShoppingCart sx={{ fontSize: 18, opacity: 0.8 }} />
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Orden de Compra
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {data.codigoVenta}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Chip
                label={`${orderProvidersCodes.length} OPs`}
                size="small"
                sx={{
                  background: alpha('#ffffff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#ffffff', 0.3)}`,
                }}
              />
            </Box>
          </Stack>
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
              background: '#05a867',
              borderRadius: '4px',
              '&:hover': {
                background: '#047856',
              }
            },
          }}
        >
          <Spin spinning={loading}>
            {orderProvidersCodes.length ? (
              <Stack direction="column" spacing={3}>
                {orderProvidersCodes.map((item, index) => (
                  <Card 
                    key={item.id} 
                    sx={{
                      background: alpha('#ffffff', 0.95),
                      border: `1px solid ${alpha('#05a867', 0.3)}`,
                      borderRadius: heroUIColors.radius.lg,
                      boxShadow: heroUIColors.shadows.md,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: heroUIColors.shadows.lg,
                        borderColor: '#05a867',
                        background: '#ffffff',
                        
                        '&::before': {
                          opacity: 1,
                        }
                      },
                      
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: '#05a867',
                        opacity: 0.7,
                        transition: 'opacity 0.3s ease',
                      }
                    }}
                  >
                    <CardHeader 
                      avatar={
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: heroUIColors.radius.md,
                            background: '#05a867',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            boxShadow: heroUIColors.shadows.sm,
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </Box>
                      }
                      title={
                        <Typography 
                          variant="h6" 
                          fontWeight={700}
                          color={heroUIColors.neutral[800]}
                          letterSpacing='-0.01em'
                        >
                          {item.codigoOp}
                        </Typography>
                      }
                      subheader={
                        <Typography 
                          variant="body2" 
                          color={heroUIColors.neutral[500]}
                          fontWeight={500}
                        >
                          Orden de Proveedor
                        </Typography>
                      }
                      sx={{ pb: 1 }}
                    />
                    
                    <Divider sx={{ borderColor: alpha('#05a867', 0.3) }} />
                    
                    <CardActions sx={{ p: 2, gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<RemoveRedEye />}
                        onClick={() => handleSelected(item.id)}
                        sx={{
                          background: '#05a867',
                          fontWeight: 600,
                          borderRadius: heroUIColors.radius.md,
                          textTransform: 'none',
                          boxShadow: heroUIColors.shadows.sm,
                          
                          '&:hover': {
                            background: '#047856',
                            transform: 'translateY(-2px)',
                            boxShadow: heroUIColors.shadows.md,
                          }
                        }}
                      >
                        Ver Detalle
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        color="error"
                        startIcon={<Delete />}
                        disabled
                        sx={{
                          borderColor: alpha(heroUIColors.error[400], 0.4),
                          color: alpha(heroUIColors.error[400], 0.6),
                          borderRadius: heroUIColors.radius.md,
                          textTransform: 'none',
                          fontWeight: 500,
                          minWidth: '120px',
                          
                          '&:hover': {
                            borderColor: alpha(heroUIColors.error[500], 0.6),
                            background: alpha(heroUIColors.error[50], 0.3),
                          }
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
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: alpha('#ffffff', 0.15),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    border: `2px solid ${alpha('#ffffff', 0.2)}`,
                  }}
                >
                  <Inventory2 sx={{ fontSize: 32, color: alpha('#ffffff', 0.7) }} />
                </Box>
                <Typography 
                  variant="h6" 
                  color="#ffffff"
                  fontWeight={600}
                  mb={1}
                >
                  Sin órdenes de proveedor
                </Typography>
                <Typography 
                  variant="body2" 
                  color={alpha('#ffffff', 0.8)}
                  maxWidth={300}
                >
                  No hay órdenes de proveedor asociadas a esta orden de compra. Agrega una nueva OP para comenzar.
                </Typography>
              </Box>
            )}
          </Spin>
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

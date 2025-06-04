import React from 'react';
import {
  Card,
  CardContent,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Skeleton,
  Box,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { PurchaseOrderData, PurchaseOrderCardProps } from '@/types/purchaseOrder';

const defaultData: PurchaseOrderData = {
  codigo: 'OCGRU660',
  fecha: '20/10/2025',
  fechaMaxima: 'Jan 9, 2014',
  opImporteTotal: 'S/ 20580.34',
  ocImporteTotal: 'S/ 20580.34'
};

const PurchaseOrderCard: React.FC<PurchaseOrderCardProps> = ({
  data = defaultData,
  showAccordions = true,
  elevation = 2,
  sx = {},
  loading = false,
  error = null
}) => {
  const accordionSections = ['Datos generales', 'Documentos', 'Cliente', 'Entrega', 'Productos'];
  if (loading) {
    return (
      <Card 
        elevation={elevation} 
        sx={{
          bgcolor: '#2C2F36',
          color: 'white',
          borderRadius: 2,
          ...sx
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width="40%" sx={{ bgcolor: '#374151', mb: 0.5 }} />
            <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: '#374151', mb: 1 }} />
            <Skeleton variant="text" width="30%" sx={{ bgcolor: '#374151' }} />
          </Box>
          
          <Divider sx={{ borderColor: '#374151', mb: 3 }} />
          
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width="30%" sx={{ bgcolor: '#374151', mb: 0.5 }} />
            <Skeleton variant="text" width="50%" sx={{ bgcolor: '#374151' }} />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width="40%" sx={{ bgcolor: '#374151', mb: 0.5 }} />
            <Skeleton variant="text" width="40%" sx={{ bgcolor: '#374151' }} />
          </Box>

          {showAccordions && (
            <Box sx={{ mt: 3 }}>
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} height={48} sx={{ bgcolor: '#374151', mb: 1, borderRadius: 1 }} />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card 
        elevation={elevation} 
        sx={{
          bgcolor: '#2C2F36',
          color: 'white',
          borderRadius: 2,
          ...sx
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Alert 
            severity="error"
            sx={{
              bgcolor: '#DC2626',
              color: 'white',
              '& .MuiAlert-icon': { color: 'white' }
            }}
          >
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card 
      elevation={elevation} 
      sx={{
        bgcolor: '#2C2F36',
        color: 'white',
        borderRadius: 2,
        ...sx
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            color: '#9CA3AF', 
            fontSize: '0.875rem', 
            fontWeight: 500,
            mb: 0.5 
          }}>
            Orden de Compra
          </Box>
          <Box sx={{ 
            fontSize: '1.5rem', 
            fontWeight: 700,
            mb: 1
          }}>
            {data.codigo}
          </Box>
          <Box sx={{ 
            color: '#9CA3AF', 
            fontSize: '0.875rem'
          }}>
            Fecha {data.fecha}
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#374151', mb: 3 }} />

        {/* F. Máxima */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            color: '#9CA3AF', 
            fontSize: '0.875rem', 
            fontWeight: 500,
            mb: 1
          }}>
            F. Máxima:
          </Box>
        </Box>

        {/* Totales */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ 
              color: '#9CA3AF', 
              fontSize: '0.875rem',
              mb: 0.5
            }}>
              OP Importe Total:
            </Box>
            <Box sx={{ 
              fontSize: '1.125rem', 
              fontWeight: 600,
              color: '#10B981'
            }}>
              {data.opImporteTotal}
            </Box>
          </Box>
          
          <Box>
            <Box sx={{ 
              color: '#9CA3AF', 
              fontSize: '0.875rem',
              mb: 0.5
            }}>
              OC Importe Total:
            </Box>
            <Box sx={{ 
              fontSize: '1.125rem', 
              fontWeight: 600,
              color: '#10B981'
            }}>
              {data.ocImporteTotal}
            </Box>
          </Box>
        </Box>

        {showAccordions && (
          <>
            <Divider sx={{ borderColor: '#374151', mb: 2 }} />
            {accordionSections.map((text, index) => (
              <Accordion 
                key={text}
                sx={{
                  bgcolor: 'transparent',
                  color: 'white',
                  boxShadow: 'none',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: 0 }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore sx={{ color: '#10B981' }} />}
                  sx={{
                    minHeight: 48,
                    px: 0,
                    '& .MuiAccordionSummary-content': {
                      margin: '12px 0'
                    },
                    '&:hover': {
                      bgcolor: 'rgba(16, 185, 129, 0.1)'
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}>
                    {text} {index < 2 && <Box component="span" sx={{ ml: 1, color: '#10B981' }}>2/4</Box>}
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                  <Box sx={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderCard;

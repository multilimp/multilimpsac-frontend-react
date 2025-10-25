import React from 'react';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Chip,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  Add as AddIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { BillingProps } from '@/services/billings/billings.d';

export interface BillingHistoryProps {
  title?: string;
  billings: BillingProps[];
  readOnly?: boolean; // en otros apartados debe ser solo lectura
  onCreateNew?: () => void; // visible solo si !readOnly
  onRefactor?: (billing: BillingProps) => void; // visible solo si !readOnly
  onViewFile?: (fileUrl: string | null | undefined) => void; // opcional; por defecto abre en nueva pestaña
  emptyDescription?: string;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({
  title = 'Historial de Facturaciones',
  billings,
  readOnly = true,
  onCreateNew,
  onRefactor,
  onViewFile,
  emptyDescription = 'No hay facturaciones registradas',
}) => {
  const handleViewFile = (fileUrl: string | null | undefined) => {
    if (onViewFile) return onViewFile(fileUrl);
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const showActions = !readOnly && !!onRefactor;
  const showCreateButton = !readOnly && !!onCreateNew;

  return (
    <Card sx={{
      border: '1px solid #e2e8f0',
      borderRadius: 2,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#667eea',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ReceiptIcon sx={{ fontSize: 24 }} />
            {title}
          </Typography>
          {showCreateButton && (
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreateNew}
                sx={{
                  bgcolor: '#667eea',
                  '&:hover': {
                    bgcolor: '#5a67d8'
                  }
                }}
              >
                Nueva Facturación
              </Button>
            </Box>
          )}
        </Box>

        {billings.length > 0 ? (
          <TableContainer sx={{
            bgcolor: '#f8fafc',
            borderRadius: 2,
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#e2e8f0' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Factura</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>GRR</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Retención</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Detracción</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Forma Envío</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Archivos</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Motivo Refact</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Tipo</TableCell>
                  {showActions && (
                    <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Acciones</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {billings.map((billing) => (
                  <TableRow
                    key={billing.id}
                    sx={{
                      '&:hover': {
                        bgcolor: '#f1f5f9'
                      }
                    }}
                  >
                    <TableCell sx={{ color: '#475569', fontWeight: 500 }}>
                      {billing.factura || 'Sin número'}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {billing.fechaFactura ? dayjs(billing.fechaFactura).format('DD/MM/YYYY') : 'Sin fecha'}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {billing.grr || 'Sin GRR'}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {billing.retencion ? `${billing.retencion}%` : '0%'}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {billing.detraccion ? `${billing.detraccion}%` : '0%'}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {billing.formaEnvioFactura || 'No especificado'}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {billing.facturaArchivo && (
                          <Chip
                            label="Factura"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                            onClick={() => handleViewFile(billing.facturaArchivo)}
                          />
                        )}
                        {billing.grrArchivo && (
                          <Chip
                            label="GRR"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                            onClick={() => handleViewFile(billing.grrArchivo)}
                          />
                        )}
                        {billing.notaCreditoArchivo && (
                          <Chip
                            label="Nota Crédito"
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '20px' }}
                            onClick={() => handleViewFile(billing.notaCreditoArchivo)}
                          />
                        )}
                        {!billing.facturaArchivo && !billing.grrArchivo && (
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            Sin archivos
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {billing.motivoRefacturacion || 'Sin motivo'}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {billing.esRefacturacion ? 'Refacturación' : 'Facturación'}
                    </TableCell>
                    {showActions && (
                      <TableCell>
                        <Stack direction="row" spacing={1.5}>
                          <Tooltip title="Refacturar" arrow placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onRefactor && onRefactor(billing)}
                              type="button"
                              sx={{
                                border: '1px solid #0ea5e9',
                                color: '#0ea5e9',
                                '&:hover': {
                                  bgcolor: 'rgba(14, 165, 233, 0.1)'
                                }
                              }}
                              aria-label="Refacturar"
                            >
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{
            textAlign: 'center',
            py: 4,
            bgcolor: '#f8fafc',
            borderRadius: 2,
            border: '2px dashed #e2e8f0'
          }}>
            <ReceiptIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
              No hay facturaciones
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
              {emptyDescription}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BillingHistory;
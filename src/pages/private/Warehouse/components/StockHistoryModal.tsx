import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { Spin, Alert, notification } from 'antd';
import { MovimientoStock } from '@/types/almacen.types';
import { getMovimientosByStock } from '@/services/almacen/almacen.requests';
import { formattedDate } from '@/utils/functions';

interface StockHistoryModalProps {
  open: boolean;
  onClose: () => void;
  productoId: number | null;
  almacenId: number | null;
}

const StockHistoryModal: React.FC<StockHistoryModalProps> = ({ open, onClose, productoId, almacenId }) => {
  const [loading, setLoading] = useState(false);
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);

  useEffect(() => {
    const loadMovimientos = async () => {
      if (!open || productoId == null || almacenId == null) return;
      try {
        setLoading(true);
        const data = await getMovimientosByStock(productoId, almacenId);
        setMovimientos(data);
      } catch (error) {
        console.error('Error al cargar historial de movimientos:', error);
        notification.error({
          message: 'Error',
          description: 'No se pudo cargar el historial de movimientos',
        });
      } finally {
        setLoading(false);
      }
    };
    loadMovimientos();
  }, [open, productoId, almacenId]);

  const renderTipoChip = (tipo: 'ENTRADA' | 'SALIDA') => (
    <Chip
      label={tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}
      size="small"
      color={tipo === 'ENTRADA' ? 'success' : 'error'}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Historial de movimientos</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <Spin size="large" tip="Cargando historial..." />
          </Box>
        ) : movimientos.length === 0 ? (
          <Alert type="info" message="No hay movimientos registrados para este stock" />
        ) : (
          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Tipo</strong></TableCell>
                  <TableCell><strong>Cantidad</strong></TableCell>
                  <TableCell><strong>Referencia</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {movimientos.map(mov => (
                  <TableRow key={mov.id} hover>
                    <TableCell>{formattedDate(mov.createdAt)}</TableCell>
                    <TableCell>{renderTipoChip(mov.tipo)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                        {Number(mov.cantidad).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{mov.referencia || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockHistoryModal;
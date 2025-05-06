
import { SaleProps } from '@/services/sales/sales';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Form } from 'antd';
import { Close, Save } from '@mui/icons-material';
import { useSalesModal } from '../../hooks/useSalesModal';

import TabPanel from './TabPanel';
import SaleFormHeader from './SaleFormHeader';
import SaleItemsTable from './SaleItemsTable';
import SaleTotals from './SaleTotals';
import SaleCompanyInfo from './SaleCompanyInfo';
import SaleAdditionalInfo from './SaleAdditionalInfo';

interface SalesModalProps {
  data: SaleProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<SaleProps>;
}

const SalesModal = ({ data, open, onClose, onSuccess, initialData }: SalesModalProps) => {
  const {
    form,
    items,
    textItems,
    clients,
    products,
    selectedProduct,
    setSelectedProduct,
    loading,
    total,
    tax,
    tabValue,
    handleAddItem,
    handleQuantityChange,
    handleDeleteItem,
    handleAddTextItem,
    handleDeleteTextItem,
    handleCopyTextItem,
    handleTabChange,
    handleSave
  } = useSalesModal(data, onClose, onSuccess, initialData);

  return (
    <Dialog 
      open={open} 
      fullWidth 
      maxWidth="lg" 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={600} color="primary">
            {data ? 'Editar Venta' : 'Registrar Nueva Venta'}
          </Typography>
          <Button variant="text" color="inherit" onClick={onClose} sx={{ minWidth: 'auto', p: 1 }}>
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      <Divider />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="sales form tabs"
          sx={{
            '.MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none'
            }
          }}
        >
          <Tab label="Información Principal" id="sale-tab-0" aria-controls="sale-tabpanel-0" />
          <Tab label="Productos" id="sale-tab-1" aria-controls="sale-tabpanel-1" />
          <Tab label="Información Adicional" id="sale-tab-2" aria-controls="sale-tabpanel-2" />
        </Tabs>
      </Box>
      
      <DialogContent>
        <Form form={form} layout="vertical" style={{ marginTop: '1rem' }}>
          <TabPanel value={tabValue} index={0}>
            <SaleFormHeader clients={clients} />
            <Divider sx={{ my: 2 }} />
            <SaleCompanyInfo />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <SaleItemsTable 
              items={items}
              textItems={textItems}
              products={products}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              onAddItem={handleAddItem}
              onQuantityChange={handleQuantityChange}
              onDeleteItem={handleDeleteItem}
              onAddTextItem={handleAddTextItem}
              onDeleteTextItem={handleDeleteTextItem}
              onCopyTextItem={handleCopyTextItem}
            />
            
            <SaleTotals total={total} tax={tax} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <SaleAdditionalInfo />
          </TabPanel>
        </Form>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={onClose} 
          disabled={loading}
          startIcon={<Close />}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          disabled={loading || items.length === 0}
          startIcon={<Save />}
        >
          {loading ? 'Guardando...' : `${data ? 'Actualizar' : 'Registrar'} Venta`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalesModal;

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Tabs, Tab, Button, Stack } from '@mui/material';
import { Add, Warehouse, Inventory } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import AlmacenesTable from './components/AlmacenesTable';
import {
    getAlmacenes,
    getProductos,
    getStock
} from '@/services/almacen/almacen.requests';
import {
    Almacen,
    Producto,
    StockWithDetails
} from '@/types/almacen.types';
import { notification } from 'antd';
import StockTable from './components/StockTable';
import ProductosTable from './components/ProductosTable';
import ProductoFormModal from './components/ProductoFormModal';
import AlmacenFormModal from './components/AlmacenFormModal';
import StockFormModal from './components/StockFormModal';

// Caché local simple con TTL para almacenes/productos/stock
const CACHE_KEY = 'warehouse_cache_v1';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

type WarehouseCache = {
  almacenes?: { data: Almacen[]; timestamp: number };
  productos?: { data: Producto[]; timestamp: number };
  stock?: { data: StockWithDetails[]; timestamp: number };
};

function loadCache(): WarehouseCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as WarehouseCache) : null;
  } catch {
    return null;
  }
}

function saveCache(next: WarehouseCache) {
  try {
    const current = loadCache() || {};
    const merged = { ...current, ...next };
    localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
  } catch {
    // noop
  }
}

function isFresh(ts?: number): boolean {
  if (!ts) return false;
  return Date.now() - ts < CACHE_TTL_MS;
}

const WarehousePage = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    // Estados para datos
    const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [stock, setStock] = useState<StockWithDetails[]>([]);

    // Estados para modales
    const [almacenModalOpen, setAlmacenModalOpen] = useState(false);
    const [productoModalOpen, setProductoModalOpen] = useState(false);
    const [stockModalOpen, setStockModalOpen] = useState(false);

    // Estados para edición
    const [editingAlmacen, setEditingAlmacen] = useState<Almacen | null>(null);
    const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
    const [editingStock, setEditingStock] = useState<StockWithDetails | null>(null);

    // Cargar datos
    const loadAlmacenes = useCallback(async (force: boolean = false) => {
        try {
            setLoading(true);
            if (!force) {
              const cache = loadCache();
              const cached = cache?.almacenes;
              if (cached && isFresh(cached.timestamp)) {
                setAlmacenes(cached.data);
                return;
              }
            }
            const data = await getAlmacenes();
            setAlmacenes(data);
            saveCache({ almacenes: { data, timestamp: Date.now() } });
        } catch (error) {
            console.error('Error al cargar almacenes:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar los almacenes',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const loadProductos = useCallback(async (force: boolean = false) => {
        try {
            setLoading(true);
            if (!force) {
              const cache = loadCache();
              const cached = cache?.productos;
              if (cached && isFresh(cached.timestamp)) {
                setProductos(cached.data);
                return;
              }
            }
            const data = await getProductos();
            setProductos(data);
            saveCache({ productos: { data, timestamp: Date.now() } });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar los productos',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const loadStock = useCallback(async (force: boolean = false) => {
        try {
            setLoading(true);
            if (!force) {
              const cache = loadCache();
              const cached = cache?.stock;
              if (cached && isFresh(cached.timestamp)) {
                setStock(cached.data);
                return;
              }
            }
            const data = await getStock();
            setStock(data);
            saveCache({ stock: { data, timestamp: Date.now() } });
        } catch (error) {
            console.error('Error al cargar stock:', error);
            notification.error({
                message: 'Error',
                description: 'No se pudo cargar el stock',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    // Efectos para cargar datos según tab activo
    useEffect(() => {
        switch (activeTab) {
            case 0:
                loadAlmacenes();
                break;
            case 1:
                loadProductos();
                break;
            case 2:
                loadStock();
                break;
        }
    }, [activeTab, loadAlmacenes, loadProductos, loadStock]);

    // Handlers para cambio de tab
    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    }, []);

    // Handlers para abrir modales
    const handleAddAlmacen = useCallback(() => {
        setEditingAlmacen(null);
        setAlmacenModalOpen(true);
    }, []);

    const handleEditAlmacen = useCallback((almacen: Almacen) => {
        setEditingAlmacen(almacen);
        setAlmacenModalOpen(true);
    }, []);

    const handleAddProducto = useCallback(() => {
        setEditingProducto(null);
        setProductoModalOpen(true);
    }, []);

    const handleEditProducto = useCallback((producto: Producto) => {
        setEditingProducto(producto);
        setProductoModalOpen(true);
    }, []);

    const handleAddStock = useCallback(() => {
        setEditingStock(null);
        setStockModalOpen(true);
    }, []);

    const handleEditStock = useCallback((stockItem: StockWithDetails) => {
        setEditingStock(stockItem);
        setStockModalOpen(true);
    }, []);

    // Handlers para cerrar modales y recargar datos (forzar refresh para invalidar caché local)
    const handleCloseAlmacenModal = useCallback(() => {
        setAlmacenModalOpen(false);
        setEditingAlmacen(null);
        loadAlmacenes(true);
    }, [loadAlmacenes]);

    const handleCloseProductoModal = useCallback(() => {
        setProductoModalOpen(false);
        setEditingProducto(null);
        loadProductos(true);
    }, [loadProductos]);

    const handleCloseStockModal = useCallback(() => {
        setStockModalOpen(false);
        setEditingStock(null);
        loadStock(true);
    }, [loadStock]);

    // Función para obtener el botón apropiado según el tab activo
    const getActionButton = () => {
        switch (activeTab) {
            case 0:
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddAlmacen}
                    >
                        Agregar Almacén
                    </Button>
                );
            case 1:
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddProducto}
                    >
                        Agregar Producto
                    </Button>
                );
            case 2:
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddStock}
                    >
                        Agregar Stock
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <PageContent
            title="Gestión de Almacén"
        >
            <Stack direction="row" spacing={1} justifyContent="flex-end" mb={2}>
                {getActionButton()}
            </Stack>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="tabs de almacén"
                    >
                        <Tab
                            label={`Almacenes (${almacenes.length})`}
                            icon={<Warehouse />}
                            iconPosition="start"
                        />
                        <Tab
                            label={`Productos (${productos.length})`}
                            icon={<Inventory />}
                            iconPosition="start"
                        />
                        <Tab
                            label={`Stock (${stock.length})`}
                            icon={<Inventory />}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {/* Tab Panel: Almacenes */}
                <div
                    role="tabpanel"
                    hidden={activeTab !== 0}
                    id="tabpanel-almacenes"
                    aria-labelledby="tab-almacenes"
                >
                    {activeTab === 0 && (
                        <Box sx={{ py: 3 }}>
                            <AlmacenesTable
                                data={almacenes}
                                loading={loading}
                                onEdit={handleEditAlmacen}
                                onReload={loadAlmacenes}
                            />
                        </Box>
                    )}
                </div>

                {/* Tab Panel: Productos */}
                <div
                    role="tabpanel"
                    hidden={activeTab !== 1}
                    id="tabpanel-productos"
                    aria-labelledby="tab-productos"
                >
                    {activeTab === 1 && (
                        <Box sx={{ py: 3 }}>
                            <ProductosTable
                                data={productos}
                                loading={loading}
                                onEdit={handleEditProducto}
                                onReload={loadProductos}
                            />
                        </Box>
                    )}
                </div>

                {/* Tab Panel: Stock */}
                <div
                    role="tabpanel"
                    hidden={activeTab !== 2}
                    id="tabpanel-stock"
                    aria-labelledby="tab-stock"
                >
                    {activeTab === 2 && (
                        <Box sx={{ py: 3 }}>
                            <StockTable
                                data={stock}
                                loading={loading}
                                onEdit={handleEditStock}
                                onReload={loadStock}
                            />
                        </Box>
                    )}
                </div>
            </Box>

            {/* Modales */}
            <AlmacenFormModal
                open={almacenModalOpen}
                onClose={handleCloseAlmacenModal}
                editingAlmacen={editingAlmacen}
            />

            <ProductoFormModal
                open={productoModalOpen}
                onClose={handleCloseProductoModal}
                editingProducto={editingProducto}
            />

            <StockFormModal
                open={stockModalOpen}
                onClose={handleCloseStockModal}
                editingStock={editingStock}
                almacenes={almacenes}
                productos={productos}
            />
        </PageContent>
    );
};

export default React.memo(WarehousePage);

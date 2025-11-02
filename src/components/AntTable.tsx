import { Fragment, useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';
import { ColumnType, TableProps } from 'antd/es/table';
import type { SortOrder } from 'antd/es/table/interface';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Drawer,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Bolt, Clear, Close, North, Reorder, Replay, SaveAlt, Search, South, Storage, SwapVert } from '@mui/icons-material';
import { removeAccents } from '@/utils/functions';

export interface AntColumnType<T = unknown> extends ColumnType<T> {
  filter?: boolean;
  sort?: boolean;
  children?: AntColumnType<T>[];
}

interface AntTablePropsProps<T = unknown> extends Omit<TableProps<T>, 'columns'> {
  data: T[];
  columns: AntColumnType<T>[];
  onReload?: () => void | Promise<void>;
  hideToolbar?: boolean;
  persistKey?: string; // clave opcional para persistencia por tabla
  autoRefreshMs?: number;
  refetchOnFocus?: boolean;
  refetchOnReconnect?: boolean;
  refreshEvents?: string[];
}

const valTypes = (value: unknown): value is number | string => typeof value === 'number' || typeof value === 'string';

const AntTable = <T,>(props: AntTablePropsProps<T>) => {
  const { columns, data, onReload, hideToolbar, persistKey, autoRefreshMs, refetchOnFocus, refetchOnReconnect, refreshEvents, ...rest } = props;
  const theme = useTheme();
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showInputs, setShowInputs] = useState(false);
  const [search, setSearch] = useState('');
  const [wait, setWait] = useState<NodeJS.Timeout>();
  const [showDrawer, setShowDrawer] = useState(false);
  const [columnsCloned, setColumnsCloned] = useState<Array<AntColumnType<T> & { selected: boolean }>>([]);

  console.log('🚀 AntTable renderizado. showInputs:', showInputs, 'columns con filter:', columns.filter(c => c.filter).length);

  // Clave de almacenamiento única por tabla
  const storageKey = useMemo(() => {
    const base = persistKey || `${typeof window !== 'undefined' ? window.location.pathname : 'unknown'}::${columns
      .map((c) => String(c.dataIndex))
      .join('|')}`;
    return `antTable.columns.${base}`;
  }, [persistKey, columns]);

  useEffect(() => {
    if (columnsCloned.length) return; // evita sobreescribir la selección actual
    // Cargar selección desde localStorage si existe
    try {
      const saved = localStorage.getItem(storageKey);
      const aux = columns.map((item) => ({ ...item, selected: true }));
      if (saved) {
        const parsed = JSON.parse(saved) as { selectedKeys?: string[] };
        if (parsed?.selectedKeys && Array.isArray(parsed.selectedKeys)) {
          aux.forEach((col) => {
            const key = String(col.dataIndex);
            col.selected = parsed.selectedKeys!.includes(key);
          });
        }
      }
      setColumnsCloned([...aux]);
    } catch {
      const aux = columns.map((item) => ({ ...item, selected: true }));
      setColumnsCloned([...aux]);
    }
  }, [columns, storageKey, columnsCloned.length]);

  // Guardar selección en localStorage cuando cambia
  useEffect(() => {
    if (!columnsCloned.length) return;
    try {
      const selectedKeys = columnsCloned.filter((c) => c.selected).map((c) => String(c.dataIndex));
      localStorage.setItem(storageKey, JSON.stringify({ selectedKeys }));
    } catch {
      // ignorar errores de almacenamiento
    }
  }, [columnsCloned, storageKey]);

  const handleFilterChange = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const clean = (value: string): string => removeAccents(value).toLowerCase();

  const filteredData = useMemo(() => {
    const filtered = (data as Array<Record<string, unknown>>)
      .filter((item) => Object.keys(filters).every((key) => clean(String(item[key] ?? '')).includes(clean(filters[key]))))
      .filter((row) => {
        const { rawdata, ...rest } = row;
        return search ? Object.values(rest).some((v) => clean(String(v ?? '')).includes(clean(search))) : true;
      }) as T[];

    return filtered;
  }, [filters, data, search]);

  // Filtrar y procesar columnas
  const columnsFiltered = useMemo(() => {
    console.log('🔄 Recalculando columnas. showInputs:', showInputs, 'columnsCloned length:', columnsCloned.length);

    if (!columnsCloned.length) {
      console.log('⚠️ columnsCloned está vacío, retornando array vacío');
      return [];
    }

    const processedColumns = columnsCloned
      .filter((item) => item.selected)
      .map((item, index) => {
        console.log(`📋 Procesando columna ${index}:`, item.title, 'filter:', item.filter, 'showInputs:', showInputs);

        // Crear una copia del item para evitar mutaciones
        const newColumn: AntColumnType<T> = { ...item };

        // Agregar ordenamiento si está habilitado
        if (item.sort) {
          newColumn.sorter = (a: T, b: T) => {
            const aObj = a as Record<string, unknown>;
            const bObj = b as Record<string, unknown>;
            const key = item.dataIndex as string;
            const valA = aObj[key];
            const valB = bObj[key];

            if (!valTypes(valA) || !valTypes(valB)) return 0;
            if (typeof valA === 'number') return valA - (valB as number);

            return String(valA).localeCompare(String(valB), undefined, { sensitivity: 'base' });
          };

          // newColumn.sortIcon = (props: { sortOrder: SortOrder }) => {
          //   if (!props.sortOrder) return <SwapVert color="disabled" />;
          //   if (props.sortOrder === 'ascend') return <North color="success" />;
          //   return <South color="success" />;
          // };

          newColumn.ellipsis = true;
        }

        // Agregar filtro en la cabecera si está habilitado
        if (showInputs && item.filter) {
          console.log('🔍 Creando filtro para columna:', item.title, 'showInputs:', showInputs);
          const key = String(item.dataIndex);

          // Crear el título con filtro
          const titleWithFilter = (
            <Stack direction="column" spacing={1} sx={{ minWidth: 120 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '13px' }}>
                {item.title?.toString()}
              </Typography>
              <TextField
                size="small"
                placeholder={`Filtrar ${item.title?.toString()}`}
                value={filters[key] ?? ''}
                onChange={(e) => {
                  e.stopPropagation();
                  console.log('🔍 Filtro cambiado:', key, e.target.value);
                  handleFilterChange(key, e.target.value);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('🔍 Click en filtro:', key);
                }}
                sx={{
                  '.MuiInputBase-root': {
                    bgcolor: '#fff',
                    fontSize: '12px',
                    height: '28px',
                    '& input': {
                      padding: '4px 8px',
                    },
                  },
                }}
              />
            </Stack>
          );

          newColumn.title = titleWithFilter;
          console.log('✅ Filtro creado para columna:', item.title);
        } else {
          console.log('❌ NO creando filtro para columna:', item.title, 'showInputs:', showInputs, 'item.filter:', item.filter);
          // Mantener el título original si no hay filtro
          newColumn.title = item.title;
        }

        return newColumn;
      });

    console.log('🏁 Columnas procesadas:', processedColumns.length, 'con filtros:', processedColumns.filter(c => showInputs && c.filter).length);
    return processedColumns;
  }, [columnsCloned, showInputs, filters, handleFilterChange]);

  // Fijar las dos primeras columnas a la izquierda y calcular scroll horizontal
  const columnsWithFixed = useMemo(() => {
    return columnsFiltered.map((col, idx) => {
      if (idx <= 1) {
        const next = { ...col } as AntColumnType<T>;
        if (!next.fixed) next.fixed = 'left';
        if (!next.width) next.width = idx === 0 ? 50 : 150;
        return next;
      }
      return col;
    });
  }, [columnsFiltered]);

  const scrollX = useMemo(() => {
    const base = columnsFiltered.reduce((sum, col) => sum + (Number(col.width) || 150), 0);
    return Math.max(base, 1200);
  }, [columnsFiltered]);

  // Merge horizontal scroll with consumer-provided vertical scroll (if any)
  const finalScroll = useMemo(() => ({ x: scrollX, ...(rest.scroll ?? {}) }), [scrollX, rest.scroll]);

  const handleDownloadCSV = () => {
    const headers = columns.map((item) => ({ label: String(item.title), key: String(item.dataIndex) }));

    const rows = (filteredData as Array<Record<string, unknown>>)
      .map((row) => headers.map((field) => `"${clean(String(row[field.key] ?? '')).replace(/\n/g, ' ')}"`).join(','));
    const csvString = [headers.map((item) => clean(item.label)).join(','), ...rows].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `data_${dayjs().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setFilters({});
    setSearch('');
    if (wait) {
      clearTimeout(wait);
      setWait(undefined);
    }
  };

  const handleReload = async () => {
    if (onReload) {
      try {
        await onReload();
      } catch (error) {
        console.error('Error al recargar datos:', error);
      }
    }
  };

  useEffect(() => {
    if (!onReload) return;
    const interval = autoRefreshMs && autoRefreshMs > 0 ? setInterval(() => {
      handleReload();
    }, autoRefreshMs) : undefined;
    const handleVisibility = () => {
      if (refetchOnFocus && document.visibilityState === 'visible') handleReload();
    };
    const handleOnline = () => {
      if (refetchOnReconnect) handleReload();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('online', handleOnline);
    const eventHandlers: Array<{ name: string; handler: () => void }> = [];
    if (refreshEvents && refreshEvents.length) {
      refreshEvents.forEach((name) => {
        const h = () => handleReload();
        window.addEventListener(name, h as EventListener);
        eventHandlers.push({ name, handler: h });
      });
    }
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
      eventHandlers.forEach(({ name, handler }) => {
        window.removeEventListener(name, handler as EventListener);
      });
      if (interval) clearInterval(interval);
    };
  }, [autoRefreshMs, refetchOnFocus, refetchOnReconnect, refreshEvents, onReload]);

  const handleChange = (str: string) => {
    clearTimeout(wait);
    const aux = setTimeout(() => {
      setSearch(str);
    }, 700);
    setWait(aux);
  };

  return (
    <Fragment>
      <Drawer anchor="left" open={showDrawer} onClose={() => setShowDrawer(false)}>
        <Box width={320} height="100%" bgcolor="secondary.dark" color="#fff">
          <CardHeader
            title="Personalizar Columnas"
            subheader="Configura la visualización de tu tabla"
            slotProps={{ title: { fontWeight: 700, fontSize: 20 } }}
            sx={{ pt: 2 }}
          />

          <CardContent sx={{ height: 'calc((100vh) - 225px)', overflow: 'auto', py: 0 }}>
            <Stack direction="column" spacing={2}>
              {columnsCloned
                .filter((item) => item.title !== 'Acciones')
                .map((item, index) => {
                  return (
                    <Card key={index + 1} sx={{ bgcolor: 'transparent', borderColor: '#4A5563' }} variant="outlined">
                      <CardActionArea
                        onClick={() => {
                          columnsCloned[index].selected = !item.selected;
                          setColumnsCloned([...columnsCloned]);
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" px={2} py={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Storage color="warning" />
                            <Typography variant="subtitle2" color="#fff">
                              {item.title?.toString()}
                            </Typography>
                          </Stack>
                          <Switch checked={item.selected} />
                        </Stack>
                      </CardActionArea>
                    </Card>
                  );
                })}
            </Stack>
          </CardContent>
          <CardActions sx={{ flexDirection: 'column', gap: 2, py: 2 }}>
            <Tooltip title="Restaurar todas las columnas visibles">
              <Button
                startIcon={<Replay />}
                fullWidth
                onClick={() => {
                  columnsCloned.forEach((_, index) => {
                    columnsCloned[index].selected = true;
                  });
                  setColumnsCloned([...columnsCloned]);
                  try {
                    localStorage.removeItem(storageKey);
                  } catch {
                    // ignorar
                  }
                }}
              >
                Reestablecer Predeterminado
              </Button>
            </Tooltip>
            <Tooltip title="Cerrar panel de personalización">
              <Button startIcon={<Close />} fullWidth variant="outlined" color="inherit" onClick={() => setShowDrawer(false)}>
                Cerrar
              </Button>
            </Tooltip>
          </CardActions>
        </Box>
      </Drawer>

      <Paper sx={{ border: '1px solid #f2f2f2' }}>
        <Table
          columns={columnsWithFixed as ColumnType<T>[]}
          dataSource={filteredData}
          scroll={finalScroll}
          sticky
          rowKey="id"
          size='small'
          rowClassName=""
          title={() => (
            <Stack direction="row" spacing={2} alignItems="center">
              {!hideToolbar && (
                <Tooltip title="Personalizar columnas">
                  <IconButton color="primary" size="small" onClick={() => setShowDrawer(true)}>
                    <Reorder />
                  </IconButton>
                </Tooltip>
              )}

              <TextField
                size="small"
                sx={{ '.MuiInputBase-root': { borderRadius: 20 } }}
                placeholder="Buscar..."
                onChange={(event) => handleChange(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="disabled" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {!hideToolbar && (
                <>
                  <Tooltip title="Filtros avanzados">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => {
                        console.log('🔧 Toggling filtros avanzados. Actual:', showInputs, 'Nuevo:', !showInputs);
                        setShowInputs(!showInputs);
                      }}
                      sx={{ border: showInputs ? '1px solid' : '0' }}
                    >
                      <Bolt />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Descargar CSV">
                    <IconButton color="primary" size="small" onClick={handleDownloadCSV}>
                      <SaveAlt />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Limpiar filtros">
                    <IconButton color="error" size="small" onClick={handleClear}>
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {onReload && (
                <Tooltip title="Recargar datos">
                  <IconButton color="success" size="small" onClick={handleReload}>
                    <Replay />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          )}
          pagination={{
            position: ['bottomCenter'], // topLeft | topCenter | topRight | bottomLeft | bottomCenter | bottomRight
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50', '100', '250', '500'],
            hideOnSinglePage: true,
            showTotal: (total, [from, to]) => `Mostrando del ${from} al ${to} de ${total} registros`,
            defaultPageSize: 20,
          }}
          {...rest}
        />
      </Paper>
    </Fragment>
  );
};

export default AntTable;
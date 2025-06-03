import { Fragment, useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import dayjs from 'dayjs';
import { ColumnType, TableProps } from 'antd/es/table';
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
  Typography,
  useTheme,
} from '@mui/material';
import { Bolt, Clear, Close, North, Reorder, Replay, SaveAlt, Search, South, Storage, SwapVert } from '@mui/icons-material';
import { removeAccents } from '@/utils/functions';

export interface AntColumnType<T> extends ColumnType<T> {
  filter?: boolean;
  sort?: boolean;
  children?: AntColumnType<T>[];
}

interface AntTablePropsProps<T> extends Omit<TableProps<T>, 'columns'> {
  data: T[];
  columns: AntColumnType<T>[];
}

const valTypes = (value: any) => ['number', 'string'].includes(typeof value);

const AntTable = <T extends Record<string, any>>(props: AntTablePropsProps<T>) => {
  const { columns, data, ...rest } = props;
  const theme = useTheme();
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showInputs, setShowInputs] = useState(false);
  const [search, setSearch] = useState('');
  const [wait, setWait] = useState<NodeJS.Timeout>();
  const [showDrawer, setShowDrawer] = useState(false);
  const [columnsCloned, setColumnsCloned] = useState<Array<AntColumnType<any> & { selected: boolean }>>([]);

  useEffect(() => {
    if (columnsCloned.length) return;
    const aux = columns.map((item) => ({ ...item, selected: true }));
    setColumnsCloned([...aux]);
  }, [columns]);

  const handleFilterChange = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const clean = (value: string): string => removeAccents(value).toLowerCase();

  const filteredData = useMemo(() => {
    const firstRecord = data[0];
    const filterRecord: any = {};

    if (firstRecord && showInputs) {
      filterRecord.id = '10012931823612536123';
      columnsCloned.forEach((item) => {
        const key = String(item.dataIndex);

        filterRecord[key] = item.filter ? (
          <TextField
            fullWidth
            size="small"
            sx={{ '.MuiInputBase-root': { bgcolor: '#fff' } }}
            placeholder={item.title?.toString()}
            value={filters[key] ?? ''}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          />
        ) : (
          ''
        );
      });
    }

    const filtered = data
      .filter((item) => Object.keys(filters).every((key) => clean(item[key]).includes(clean(filters[key]))))
      .filter(({ rawdata, ...rest }) => (search ? Object.values(rest).some((item) => clean(String(item || '')).includes(clean(search))) : true));

    if (Object.values(filterRecord).length) {
      filtered.unshift(filterRecord);
    }

    return filtered;
  }, [filters, data, showInputs, search]);

  const columnsFiltered = useMemo(
    () =>
      columnsCloned
        .filter((item) => item.selected)
        .map((item) => {
          const newItemProperties: AntColumnType<any> = {};

          if (item.sort) {
            const sortProperties: AntColumnType<any> = {
              sorter: (a: any, b: any) => {
                const valA = a[item.dataIndex];
                const valB = b[item.dataIndex];

                if (!valTypes(valA) || !valTypes(valB)) return 0;
                if (typeof valA === 'number') return valA - valB;

                return String(valA).localeCompare(valB, undefined, { sensitivity: 'base' });
              },
              sortIcon(params: any) {
                if (!params.sortOrder) return <SwapVert color="disabled" />;
                if (params.sortOrder === 'ascend') return <North color="success" />;
                return <South color="success" />;
              },
              ellipsis: true,
            };

            Object.assign(newItemProperties, sortProperties);
          }

          if (showInputs) {
            const filterProperties: AntColumnType<any> = {
              onCell: (_, index) => ({
                style: {
                  backgroundColor: index === 0 ? theme.palette.secondary.main : '#fff',
                },
              }),
            };

            Object.assign(newItemProperties, filterProperties);
          }

          return { ...newItemProperties, ...item };
        }),
    [columnsCloned, showInputs]
  );

  const handleDownloadCSV = () => {
    const headers = columns.map((item) => ({ label: String(item.title), key: String(item.dataIndex) }));

    const rows = filteredData
      .filter((_, index) => (showInputs ? index > 0 : true))
      .map((row) => headers.map((field) => `"${clean(row[field.key]).replace(/\n/g, ' ')}"`).join(','));
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
  };

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
                    <Card key={index + 1} sx={{ bgcolor: 'transparent' }} variant="outlined">
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
            <Button
              startIcon={<Replay />}
              fullWidth
              onClick={() => {
                columnsCloned.forEach((_, index) => {
                  columnsCloned[index].selected = true;
                });
                setColumnsCloned([...columnsCloned]);
              }}
            >
              Reestablecer Predeterminado
            </Button>
            <Button startIcon={<Close />} fullWidth variant="outlined" color="inherit" onClick={() => setShowDrawer(false)}>
              Cerrar
            </Button>
          </CardActions>
        </Box>
      </Drawer>

      <Paper sx={{ border: '1px solid #f2f2f2' }}>
        <Table
          columns={columnsFiltered}
          dataSource={filteredData}
          scroll={{ x: '100%' }}
          rowKey="id"
          rowClassName={showInputs ? 'table-filter-row' : ''}
          title={() => (
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton color="primary" size="small" onClick={() => setShowDrawer(true)}>
                <Reorder />
              </IconButton>

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

              <IconButton color="primary" size="small" onClick={() => setShowInputs(!showInputs)} sx={{ border: showInputs ? '1px solid' : '0' }}>
                <Bolt />
              </IconButton>
              <IconButton color="primary" size="small" onClick={handleDownloadCSV}>
                <SaveAlt />
              </IconButton>
              <IconButton color="error" size="small" onClick={handleClear}>
                <Clear />
              </IconButton>
            </Stack>
          )}
          pagination={{
            position: ['bottomCenter'], // topLeft | topCenter | topRight | bottomLeft | bottomCenter | bottomRight
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100', '250', '500'],
            hideOnSinglePage: true,
            showTotal: (total, [from, to]) => `Mostrando del ${from} al ${to} de ${total} registros`,
          }}
          {...rest}
        />
      </Paper>
    </Fragment>
  );
};

export default AntTable;

import { Table } from 'antd';
import { IconButton, InputAdornment, Paper, Stack, TextField, useTheme } from '@mui/material';
import { ColumnType, TableProps } from 'antd/es/table';
import { Bolt, North, Reorder, Replay, SaveAlt, Search, South, SwapVert } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

export interface AntColumnType<T> extends ColumnType<T> {
  filter?: boolean;
  sort?: boolean;
  children?: AntColumnType<T>[];
}

interface CustomTablePropsProps<T> extends Omit<TableProps<T>, 'columns'> {
  data: T[];
  columns: AntColumnType<T>[];
}

const valTypes = (value: any) => ['number', 'string'].includes(typeof value);

const CustomTable = <T extends Record<string, any>>(props: CustomTablePropsProps<T>) => {
  const { columns, data, ...rest } = props;
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showInputs, setShowInputs] = useState(false);
  const theme = useTheme();

  const handleFilterChange = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const filteredData = useMemo(() => {
    const firstRecord = data[0];
    const filterRecord: any = {};

    if (firstRecord && showInputs) {
      columns.forEach((item) => {
        const key = String(item.dataIndex);

        filterRecord[key] = item.filter ? (
          <TextField
            fullWidth
            size="small"
            sx={{ '.MuiInputBase-root': { bgcolor: '#fff' } }}
            placeholder={item.title?.toString()}
            value={filters[key]}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          />
        ) : (
          ''
        );
      });
    }

    const filtered = data.filter((item) => Object.keys(filters).every((key) => item[key].toLowerCase().includes(filters[key].toLowerCase())));

    if (Object.values(filterRecord).length) {
      filtered.unshift(filterRecord);
    }

    return filtered;
  }, [filters, data, showInputs]);

  const auxColumns = useMemo(
    () =>
      columns?.map((item) => {
        const newItemProperties: AntColumnType<any> = {
          align: 'center',
        };

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
    [columns, showInputs]
  );

  const handleDownloadCSV = () => {
    const headers = columns.map((item) => ({ label: String(item.title), key: String(item.dataIndex) }));

    const rows = filteredData.map((row) =>
      headers
        .map((field) => {
          const value = row[field.key] ?? '';
          const escaped = `${value}`.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    );
    const csvString = [headers.map((item) => item.label).join(','), ...rows].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `data_${dayjs().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid #2f2f2f' }}>
      <Table
        columns={auxColumns}
        dataSource={filteredData}
        scroll={{ x: '100%' }}
        rowKey="id"
        rowClassName={showInputs ? 'table-filter-row' : ''}
        title={() => (
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="primary" size="small">
              <Reorder />
            </IconButton>

            <TextField
              size="small"
              sx={{ '.MuiInputBase-root': { borderRadius: 20 } }}
              placeholder="Buscar..."
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
            <IconButton color="primary" size="small">
              <Replay />
            </IconButton>
          </Stack>
        )}
        {...rest}
      />
    </Paper>
  );
};

export default CustomTable;

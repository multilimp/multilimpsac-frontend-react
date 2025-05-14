import React, { Fragment, useRef, useState } from 'react';
import type { InputRef, TableColumnType } from 'antd';
import { Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { Box, Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import { ColumnType, TableProps } from 'antd/es/table';
import { useTheme } from '@mui/material/styles';

export interface AntColumnType<T> extends ColumnType<T> {
  filter?: boolean;
  children?: AntColumnType<T>[];
}

interface AntTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  data: T[];
  columns: AntColumnType<T>[];
}

const AntTable = <T extends Record<string, any>>(props: AntTableProps<T>) => {
  const { columns, data, ...rest } = props;
  const [searchText, setSearchText] = useState<React.Key>('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const theme = useTheme();

  const getColumnSearchProps = (dataIndex: any): TableColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      return (
        <Box p={1.5} sx={{ minWidth: 220 }}>
          <TextField
            variant="outlined"
            placeholder="Buscar..."
            size="small"
            sx={{
              width: '100%',
              mb: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              },
            }}
            value={selectedKeys[0] ?? ''}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirm();
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      clearFilters?.();
                      setSelectedKeys([]);
                      confirm();
                    }}
                    size="small"
                    color="error"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              color="error"
              size="small"
              onClick={() => {
                clearFilters?.();
                setSelectedKeys([]);
                confirm();
              }}
            >
              Limpiar
            </Button>
            <Button
              fullWidth
              color="success"
              size="small"
              onClick={() => {
                confirm();
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Buscar
            </Button>
          </Stack>
        </Box>
      );
    },
    filterIcon: (filtered: boolean) => (
      <Search
        style={{
          color: filtered ? theme.palette.primary.main : undefined,
          fontSize: '1.1rem',
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) => (
      <Fragment>
        {searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffd54f', padding: 0 }}
            searchWords={[String(searchText)]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        )}
      </Fragment>
    ),
  });

  const auxColumns = columns.map((item) => {
    if (!item.filter) return item;
    return { ...item, ...getColumnSearchProps(item.dataIndex) };
  });

  return (
    <Table
      columns={auxColumns}
      dataSource={data}
      size="small"
      scroll={{ x: '100%' }}
      bordered
      rowKey="id"
      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
      {...rest}
    />
  );
};

export default AntTable;

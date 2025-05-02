
import React, { useRef, useState } from 'react';
import type { InputRef, TableColumnType } from 'antd';
import { Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
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
              }
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Box
              component="button"
              sx={{
                bgcolor: theme.palette.error.main,
                color: '#fff',
                border: 'none',
                borderRadius: 1,
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                cursor: 'pointer',
                '&:hover': { bgcolor: theme.palette.error.dark },
              }}
              onClick={() => {
                clearFilters?.();
                setSelectedKeys([]);
                confirm();
              }}
            >
              Limpiar
            </Box>
            <Box
              component="button"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                border: 'none',
                borderRadius: 1,
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                cursor: 'pointer',
                '&:hover': { bgcolor: theme.palette.primary.dark },
              }}
              onClick={() => {
                confirm();
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Buscar
            </Box>
          </Box>
        </Box>
      );
    },
    filterIcon: (filtered: boolean) => (
      <Search 
        style={{ 
          color: filtered ? theme.palette.primary.main : undefined,
          fontSize: '1.1rem'
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
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffd54f', padding: 0 }}
          searchWords={[String(searchText)]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
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
      {...rest}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      className="modern-table"
    />
  );
};

export default AntTable;

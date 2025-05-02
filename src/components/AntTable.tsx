
import React, { useRef, useState } from 'react';
import type { InputRef, TableColumnType } from 'antd';
import { Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';
import { ColumnType, TableProps } from 'antd/es/table';

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

  const getColumnSearchProps = (dataIndex: any): TableColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
      return (
        <Box p={1}>
          <TextField
            variant="outlined"
            label="Buscar..."
            size="small"
            sx={{ maxWidth: 200 }}
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
                    color="error"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      );
    },
    filterIcon: (filtered: boolean) => <Search style={{ color: filtered ? '#1677ff' : '#ffffff' }} />,
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
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
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

  return <Table columns={auxColumns} dataSource={data} size="small" scroll={{ x: '100%' }} bordered rowKey="id" {...rest} />;
};

export default AntTable;

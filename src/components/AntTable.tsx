import { useRef, useState } from 'react';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Button, ButtonGroup, Stack, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { TableProps } from 'antd/lib';

interface AntTableProps<T> extends Omit<TableProps, 'columns'> {
  data: Array<T>;
  columns: TableColumnsType<T>;
}

const AntTable = <T,>({ columns, data, ...rest }: AntTableProps<T>) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: string) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex: string): TableColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <Stack direction="column" p={1.5}>
        <TextField
          size="small"
          label="Ingrese texto para buscar"
          placeholder={`Buscar por ${dataIndex}`}
          slotProps={{ inputLabel: { shrink: true } }}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onKeyUp={(event) => event.code === 'Enter' && handleSearch(selectedKeys as string[], confirm, dataIndex)}
          sx={{ mb: 1 }}
        />

        <ButtonGroup fullWidth size="small">
          <Button onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}>Buscar</Button>
          <Button
            onClick={() => {
              clearFilters?.();
              handleSearch([], confirm, dataIndex);
              setSearchText('');
              setSelectedKeys([]);
              close();
            }}
            color="error"
          >
            Limpiar
          </Button>
        </ButtonGroup>
      </Stack>
    ),
    filterIcon: (filtered: boolean) => <Search style={{ color: filtered ? '#1677ff' : undefined }} />,
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
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const auxColumns = columns.map((item) => ({ ...item, ...getColumnSearchProps('name') }));

  return <Table<T> columns={auxColumns} dataSource={data} size="large" scroll={{ x: '100%' }} rowKey="_id" {...rest} />;
};

export default AntTable;

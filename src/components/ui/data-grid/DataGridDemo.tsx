
import React, { useState } from "react";
import { DataGrid, DataGridColumn } from "./index";

interface DemoData {
  id: number;
  name: string;
  price: number;
  date: string;
  category: string;
}

const mockData: DemoData[] = Array.from({ length: 50 }).map((_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: Math.floor(Math.random() * 1000) + 10,
  date: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
  category: ['Electronics', 'Clothing', 'Food', 'Books'][
    Math.floor(Math.random() * 4)
  ]
}));

const columns: DataGridColumn[] = [
  { key: 'id', name: 'ID', type: 'number', sortable: true, filterable: true },
  { key: 'name', name: 'Name', type: 'string', sortable: true, filterable: true },
  { key: 'price', name: 'Price', type: 'number', sortable: true, filterable: true },
  { key: 'date', name: 'Date', type: 'date', sortable: true, filterable: true },
  { key: 'category', name: 'Category', type: 'string', sortable: true, filterable: true },
];

const DataGridDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  const handleReload = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handleRowClick = (row: DemoData) => {
    console.log('Row clicked:', row);
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Data Grid Example</h2>
      
      <DataGrid 
        data={mockData}
        columns={columns}
        loading={loading}
        pageSize={10}
        onRowClick={handleRowClick}
        onReload={handleReload}
      />
    </div>
  );
};

export default DataGridDemo;

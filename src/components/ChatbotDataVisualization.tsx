import React from 'react';
import { Table, Card, List, Tag, Typography, Row, Col, Statistic } from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  DollarOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface DataVisualizationProps {
  data: any[];
  visualization: 'table' | 'chart' | 'list' | 'card';
  message: string;
}

const ChatbotDataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  visualization,
  message
}) => {
  if (!data || data.length === 0) {
    return (
      <Card size="small" style={{ margin: '8px 0' }}>
        <Text type="secondary">No se encontraron datos para mostrar</Text>
      </Card>
    );
  }

  const renderTable = () => {
    if (data.length === 0) return null;

    // Generar columnas dinámicamente basado en las claves del primer objeto
    const columns = Object.keys(data[0]).map(key => ({
      title: key.charAt(0).toUpperCase() + key.slice(1),
      dataIndex: key,
      key: key,
      render: (value: any) => {
        if (typeof value === 'boolean') {
          return <Tag color={value ? 'green' : 'red'}>{value ? 'Sí' : 'No'}</Tag>;
        }
        if (key.toLowerCase().includes('fecha') && value) {
          return new Date(value).toLocaleDateString('es-PE');
        }
        if (key.toLowerCase().includes('monto') || key.toLowerCase().includes('precio')) {
          return `S/. ${Number(value).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
        }
        return value?.toString() || '-';
      }
    }));

    return (
      <Table
        dataSource={data.map((item, index) => ({ ...item, key: index }))}
        columns={columns}
        pagination={{ pageSize: 5, size: 'small' }}
        size="small"
        scroll={{ x: true }}
        style={{ margin: '8px 0' }}
      />
    );
  };

  const renderList = () => {
    return (
      <List
        size="small"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <Card size="small" style={{ width: '100%' }}>
              {Object.entries(item).map(([key, value]) => (
                <div key={key} style={{ marginBottom: 4 }}>
                  <Text strong>{key}: </Text>
                  <Text>{value?.toString() || '-'}</Text>
                </div>
              ))}
            </Card>
          </List.Item>
        )}
        style={{ margin: '8px 0' }}
      />
    );
  };

  const renderCard = () => {
    const item = data[0];
    return (
      <Card size="small" style={{ margin: '8px 0' }}>
        <Row gutter={[16, 16]}>
          {Object.entries(item).map(([key, value]) => (
            <Col span={12} key={key}>
              <Statistic
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value?.toString() || '-'}
                prefix={getIconForField(key)}
              />
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  const renderChart = () => {
    // Para datos estadísticos simples
    if (data.length === 1) {
      const item = data[0];
      return (
        <Card size="small" style={{ margin: '8px 0' }}>
          <Row gutter={[16, 16]}>
            {Object.entries(item).map(([key, value]) => (
              <Col span={8} key={key}>
                <Card size="small">
                  <Statistic
                    title={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value as number}
                    prefix={getIconForField(key)}
                    valueStyle={{ 
                      color: getColorForField(key),
                      fontSize: '1.2rem'
                    }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      );
    }

    // Para múltiples registros, mostrar como lista con métricas
    return renderList();
  };

  const getIconForField = (field: string) => {
    const fieldLower = field.toLowerCase();
    if (fieldLower.includes('usuario') || fieldLower.includes('cliente')) {
      return <UserOutlined />;
    }
    if (fieldLower.includes('producto') || fieldLower.includes('orden')) {
      return <ShoppingOutlined />;
    }
    if (fieldLower.includes('monto') || fieldLower.includes('precio') || fieldLower.includes('venta')) {
      return <DollarOutlined />;
    }
    return <FileTextOutlined />;
  };

  const getColorForField = (field: string) => {
    const fieldLower = field.toLowerCase();
    if (fieldLower.includes('activo') || fieldLower.includes('completad')) {
      return '#52c41a';
    }
    if (fieldLower.includes('pendiente') || fieldLower.includes('proceso')) {
      return '#faad14';
    }
    if (fieldLower.includes('inactivo') || fieldLower.includes('cancelad')) {
      return '#ff4d4f';
    }
    return '#1890ff';
  };

  const renderVisualization = () => {
    switch (visualization) {
      case 'table':
        return renderTable();
      case 'list':
        return renderList();
      case 'card':
        return renderCard();
      case 'chart':
        return renderChart();
      default:
        return renderTable();
    }
  };

  return (
    <div style={{ margin: '8px 0' }}>
      {renderVisualization()}
      <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#f6f6f6', borderRadius: 6 }}>
        <Text type="secondary" style={{ fontSize: '0.85rem' }}>
          📊 Mostrando {data.length} resultado{data.length !== 1 ? 's' : ''}
        </Text>
      </div>
    </div>
  );
};

export default ChatbotDataVisualization;

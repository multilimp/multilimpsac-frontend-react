import React, { useState, useRef, useEffect } from 'react';
import { 
  FloatButton, 
  Modal, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Card, 
  Tag, 
  Spin, 
  message as antMessage,
  Tooltip,
  Row,
  Col
} from 'antd';
import { 
  MessageOutlined, 
  SendOutlined, 
  CloseOutlined,
  RobotOutlined,
  UserOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import chatbotService, { ChatbotResponse, QuickAction } from '../services/chatbot/chatbot.service';
import ChatbotDataVisualization from './ChatbotDataVisualization';

const { Text, Title } = Typography;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'data' | 'suggestion';
  data?: any[];
  visualization?: 'table' | 'chart' | 'list' | 'card';
  suggestions?: string[];
}

interface ChatbotButtonProps {
  onOpen?: () => void;
  onClose?: () => void;
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onOpen, onClose }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente virtual de Multilimp. Puedo ayudarte con consultas sobre clientes, usuarios, órdenes de compra, proveedores, ventas y más. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar acciones rápidas al abrir el modal
  useEffect(() => {
    if (open) {
      loadQuickActions();
    }
  }, [open]);

  const loadQuickActions = async () => {
    try {
      const actions = await chatbotService.getQuickActions();
      setQuickActions(actions);
    } catch (error) {
      console.error('Error cargando acciones rápidas:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const addMessage = (
    text: string, 
    isUser: boolean = true, 
    type: 'text' | 'data' | 'suggestion' = 'text', 
    data?: any[], 
    visualization?: 'table' | 'chart' | 'list' | 'card',
    suggestions?: string[]
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      type,
      data,
      visualization,
      suggestions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processUserMessage = async (message: string) => {
    setIsLoading(true);
    addMessage(message, true);

    try {
      const response: ChatbotResponse = await chatbotService.sendMessage(message);
      
      addMessage(
        response.message, 
        false, 
        response.data ? 'data' : 'text',
        response.data,
        response.visualization,
        response.suggestions
      );
    } catch (error: any) {
      console.error('Error procesando mensaje:', error);
      antMessage.error('Error comunicándose con el asistente virtual');
      
      addMessage(
        'Lo siento, ocurrió un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      processUserMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickActionClick = (action: QuickAction) => {
    processUserMessage(action.query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    processUserMessage(suggestion);
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <div>
        <Text style={{ whiteSpace: 'pre-line' }}>
          {message.text}
        </Text>
        
        {message.type === 'data' && message.data && message.visualization && (
          <ChatbotDataVisualization
            data={message.data}
            visualization={message.visualization}
            message={message.text}
          />
        )}
        
        {message.suggestions && message.suggestions.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: '0.85rem', marginBottom: 4, display: 'block' }}>
              Consultas relacionadas:
            </Text>
            <Space wrap>
              {message.suggestions.map((suggestion, index) => (
                <Tag
                  key={index}
                  color="blue"
                  style={{ cursor: 'pointer', margin: '2px 0' }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        onClick={handleOpen}
        style={{
          right: 24,
          bottom: 24,
        }}
        tooltip="Asistente Virtual"
      />

      <Modal
        title={
          <Space>
            <RobotOutlined style={{ color: '#1890ff' }} />
            <span>Asistente Virtual Multilimp</span>
            <Tag color="green">Conectado</Tag>
          </Space>
        }
        open={open}
        onCancel={handleClose}
        footer={null}
        width={700}
        style={{ top: 20 }}
        bodyStyle={{ 
          height: '70vh', 
          maxHeight: '600px',
          padding: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >

        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                marginBottom: 8
              }}
            >
              <div style={{
                maxWidth: '85%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8
              }}>
                {!message.isUser && (
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <RobotOutlined style={{ color: 'white', fontSize: 16 }} />
                  </div>
                )}
                
                <Card 
                  size="small"
                  style={{
                    backgroundColor: message.isUser ? '#1890ff' : '#f6f6f6',
                    border: 'none',
                    borderRadius: 12,
                    maxWidth: '100%'
                  }}
                  bodyStyle={{
                    padding: '12px 16px',
                    color: message.isUser ? 'white' : '#000'
                  }}
                >
                  {renderMessage(message)}
                </Card>
                
                {message.isUser && (
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#d9d9d9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <UserOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <RobotOutlined style={{ color: 'white', fontSize: 16 }} />
              </div>
              <Card 
                size="small"
                style={{
                  backgroundColor: '#f6f6f6',
                  border: 'none',
                  borderRadius: 12
                }}
                bodyStyle={{ padding: '12px 16px' }}
              >
                <Space>
                  <Spin size="small" />
                  <Text type="secondary">Procesando...</Text>
                </Space>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && quickActions.length > 0 && (
          <div style={{ padding: '0 16px 16px' }}>
            <Text type="secondary" style={{ marginBottom: 8, display: 'block' }}>
              Consultas rápidas:
            </Text>
            <Row gutter={[8, 8]}>
              {quickActions.map((action) => (
                <Col key={action.id}>
                  <Tooltip title={action.description}>
                    <Tag
                      color="blue"
                      style={{ cursor: 'pointer', padding: '4px 8px' }}
                      onClick={() => handleQuickActionClick(action)}
                    >
                      <QuestionCircleOutlined style={{ marginRight: 4 }} />
                      {action.title}
                    </Tag>
                  </Tooltip>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          gap: 8
        }}>
          <Input
            placeholder="Escribe tu consulta sobre clientes, órdenes, usuarios..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleKeyPress}
            disabled={isLoading}
            style={{ flex: 1 }}
            suffix={
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="small"
                style={{ border: 'none', boxShadow: 'none' }}
              />
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default ChatbotButton; 
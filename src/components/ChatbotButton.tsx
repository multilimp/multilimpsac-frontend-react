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
  Col,
  Avatar,
  Divider,
  Badge
} from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
  RobotOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  ClearOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import chatbotService, { ChatbotResponse, QuickAction } from '../services/chatbot/chatbot.service';
import ChatbotDataVisualization from './ChatbotDataVisualization';

const { Text, Title, Paragraph } = Typography;
const { TextArea } = Input;

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

  const handleClearChat = () => {
    setMessages([{
      id: '1',
      text: '¡Hola! Soy tu asistente virtual de Multilimp. Puedo ayudarte con consultas sobre clientes, usuarios, órdenes de compra, proveedores, ventas y más. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }]);
    antMessage.success('Chat limpiado');
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
      <div style={{ width: '100%' }}>
        <Paragraph
          style={{
            whiteSpace: 'pre-line',
            margin: 0,
            color: message.isUser ? '#fff' : 'inherit'
          }}
        >
          {message.text}
        </Paragraph>

        {message.type === 'data' && message.data && message.visualization && (
          <div style={{ marginTop: 12 }}>
            <ChatbotDataVisualization
              data={message.data}
              visualization={message.visualization}
              message={message.text}
            />
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <Text
              type="secondary"
              style={{
                fontSize: '0.85rem',
                marginBottom: 8,
                display: 'block',
                color: message.isUser ? 'rgba(255,255,255,0.85)' : undefined
              }}
            >
              <ThunderboltOutlined style={{ marginRight: 4 }} />
              Consultas relacionadas:
            </Text>
            <Space wrap size={[4, 4]}>
              {message.suggestions.map((suggestion, index) => (
                <Tag
                  key={index}
                  color={message.isUser ? 'default' : 'processing'}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 12,
                    fontSize: '0.85rem'
                  }}
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
        tooltip={<span>Asistente Virtual - IA</span>}
      />

      <Modal
        title={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0'
          }}>
            <Space size={12}>
              <Avatar
                size={40}
                icon={<RobotOutlined />}
                style={{
                  backgroundColor: '#1890ff',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                }}
              />
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  Asistente Virtual Multilimp
                </Title>
                <Space size={4}>
                  <Badge status="success" />
                  <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                    Conectado - Powered by IA
                  </Text>
                </Space>
              </div>
            </Space>
            <Space>
              <Tooltip title="Limpiar conversación">
                <Button
                  icon={<ClearOutlined />}
                  size="small"
                  type="text"
                  onClick={handleClearChat}
                />
              </Tooltip>
            </Space>
          </div>
        }
        open={open}
        onCancel={handleClose}
        footer={null}
        width={750}
        style={{ top: 20 }}
        styles={{
          header: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '8px 8px 0 0',
            padding: '16px 24px'
          },
          body: {
            height: '75vh',
            maxHeight: '650px',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            background: '#f8f9fa'
          }
        }}
        closeIcon={<CloseOutlined style={{ color: 'gray', fontSize: 18 }} />}
      >
        {/* Acciones Rápidas - Solo cuando no hay mensajes */}
        {messages.length === 1 && quickActions.length > 0 && (
          <div style={{
            padding: '20px 24px',
            background: 'white',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ThunderboltOutlined style={{ color: '#faad14', fontSize: 16 }} />
                <Text strong style={{ fontSize: '0.95rem' }}>
                  Acciones Rápidas
                </Text>
              </div>
              <Row gutter={[8, 8]}>
                {quickActions.map((action) => (
                  <Col key={action.id} xs={24} sm={12}>
                    <Card
                      hoverable
                      size="small"
                      onClick={() => handleQuickActionClick(action)}
                      style={{
                        borderRadius: 8,
                        border: '1px solid #e8e8e8',
                        transition: 'all 0.3s'
                      }}
                      styles={{
                        body: { padding: '12px' }
                      }}
                    >
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Text strong style={{ fontSize: '0.9rem' }}>
                          <QuestionCircleOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                          {action.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                          {action.description}
                        </Text>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </div>
        )}

        {/* Área de Mensajes */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#f8f9fa'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                animation: 'fadeIn 0.3s ease-in'
              }}
            >
              <div style={{
                maxWidth: '80%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                flexDirection: message.isUser ? 'row-reverse' : 'row'
              }}>
                <Avatar
                  size={36}
                  icon={message.isUser ? <UserOutlined /> : <RobotOutlined />}
                  style={{
                    backgroundColor: message.isUser ? '#722ed1' : '#1890ff',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}
                />

                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  alignItems: message.isUser ? 'flex-end' : 'flex-start'
                }}>
                  <Card
                    size="small"
                    style={{
                      background: message.isUser
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'white',
                      border: 'none',
                      borderRadius: message.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                      maxWidth: '100%'
                    }}
                    styles={{
                      body: {
                        padding: '14px 16px',
                        color: message.isUser ? 'white' : '#000'
                      }
                    }}
                  >
                    {renderMessage(message)}
                  </Card>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '0.75rem',
                      paddingLeft: message.isUser ? 0 : 4,
                      paddingRight: message.isUser ? 4 : 0
                    }}
                  >
                    <HistoryOutlined style={{ marginRight: 4 }} />
                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              animation: 'fadeIn 0.3s ease-in'
            }}>
              <Avatar
                size={36}
                icon={<RobotOutlined />}
                style={{
                  backgroundColor: '#1890ff',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              />
              <Card
                size="small"
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '16px 16px 16px 4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
                styles={{ body: { padding: '14px 16px' } }}
              >
                <Space>
                  <Spin size="small" />
                  <Text type="secondary">Analizando tu consulta...</Text>
                </Space>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Área de Input */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f0f0f0',
          background: 'white',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <Space.Compact style={{ width: '100%' }} size="large">
            <TextArea
              placeholder="Escribe tu consulta... (Shift + Enter para nueva línea)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleKeyPress}
              disabled={isLoading}
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{
                borderRadius: '24px 0 0 24px',
                resize: 'none',
                fontSize: '0.95rem'
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              loading={isLoading}
              size="large"
              style={{
                borderRadius: '0 24px 24px 0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: 'none',
                height: 'auto',
                minWidth: 80
              }}
            >
              Enviar
            </Button>
          </Space.Compact>
          <Text
            type="secondary"
            style={{
              fontSize: '0.75rem',
              display: 'block',
              marginTop: 8,
              textAlign: 'center'
            }}
          >
            <CodeOutlined style={{ marginRight: 4 }} />
            Powered by NL2SQL Agent
          </Text>
        </div>
      </Modal>

      {/* Estilos CSS en línea */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ChatbotButton; 
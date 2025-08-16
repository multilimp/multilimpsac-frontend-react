import apiClient from '../apiClient';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    sqlQuery?: string;
    executionTime?: number;
    resultCount?: number;
  };
}

export interface ChatbotResponse {
  message: string;
  data?: any[];
  visualization?: 'table' | 'chart' | 'list' | 'card';
  suggestions?: string[];
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  query: string;
}

class ChatbotService {
  async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      const response = await apiClient.post('/chatbot/message', { message });
      return response.data.response;
    } catch (error: any) {
      console.error('Error enviando mensaje al chatbot:', error);
      throw new Error(
        error.response?.data?.message || 'Error comunicándose con el asistente virtual'
      );
    }
  }

  async getQuickActions(): Promise<QuickAction[]> {
    try {
      const response = await apiClient.get('/chatbot/quick-actions');
      return response.data.quickActions;
    } catch (error) {
      console.error('Error obteniendo acciones rápidas:', error);
      return this.getDefaultQuickActions();
    }
  }

  async getChatHistory(limit: number = 20): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get(`/chatbot/history?limit=${limit}`);
      return response.data.messages;
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }

  private getDefaultQuickActions(): QuickAction[] {
    return [
      {
        id: 'clientes-activos',
        title: 'Clientes Activos',
        description: 'Ver lista de clientes activos',
        query: 'Muéstrame los clientes activos'
      },
      {
        id: 'ordenes-mes',
        title: 'Órdenes del Mes',
        description: 'Órdenes de compra de este mes',
        query: 'Lista las órdenes de compra de este mes'
      },
      {
        id: 'usuarios-sistema',
        title: 'Usuarios del Sistema',
        description: 'Ver todos los usuarios registrados',
        query: 'Cuántos usuarios hay en el sistema'
      },
      {
        id: 'ventas-resumen',
        title: 'Resumen de Ventas',
        description: 'Estadísticas de ventas recientes',
        query: 'Muéstrame un resumen de las ventas'
      }
    ];
  }
}

export default new ChatbotService();

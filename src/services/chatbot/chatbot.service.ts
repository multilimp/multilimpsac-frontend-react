import axios from 'axios';

const CHATBOT_API_URL = import.meta.env.VITE_APP_CHATBOT_API_URL || 'http://localhost:8000';

const chatbotClient = axios.create({
  baseURL: CHATBOT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos para respuestas del chatbot
});

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
  sqlQuery?: string; // Para debugging
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
      const response = await chatbotClient.post('/query', {
        question: message,
        include_sql: true,
        format_response: true
      });

      // Mapear tipos de visualización del backend a los del frontend
      const backendViz = response.data.visualization;
      let frontendViz: 'table' | 'chart' | 'list' | 'card' = 'card';

      if (backendViz === 'table') {
        frontendViz = 'table';
      } else if (['bar_chart', 'line_chart', 'pie_chart'].includes(backendViz)) {
        frontendViz = 'chart';
      } else if (backendViz === 'kpi') {
        // KPI se muestra como card con el valor destacado
        frontendViz = 'card';
      } else if (backendViz === 'text') {
        // Texto simple sin visualización
        frontendViz = 'card';
      }

      return {
        message: response.data.answer,
        data: response.data.data,
        visualization: frontendViz,
        suggestions: response.data.metadata?.suggestions || [],
        sqlQuery: response.data.sql_query
      };
    } catch (error: any) {
      console.error('Error enviando mensaje al chatbot:', error);
      throw new Error(
        error.response?.data?.error || 'Error comunicándose con el asistente virtual'
      );
    }
  }

  async getChatHistory(limit: number = 20): Promise<ChatMessage[]> {
    try {
      const response = await chatbotClient.get(`/history?limit=${limit}`);
      return response.data.messages || [];
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await chatbotClient.get('/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

}

export default new ChatbotService();

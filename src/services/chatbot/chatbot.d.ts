export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatbotResponse {
    message: string;
    data?: any[];
    visualization?: 'table' | 'chart' | 'list' | 'card';
    suggestions?: string[];
    sqlQuery?: string;
}

export interface AgentResponse {
    answer: string;
    sql_query: string | null;
    data: any[];
    visualization: 'kpi' | 'table' | 'bar_chart' | 'line_chart' | 'pie_chart' | 'text';
    row_count: number;
    truncated: boolean;
    success: boolean;
    error: string | null;
    metadata: {
        primary_value?: number;
        context?: Record<string, any>;
        execution_time_seconds?: number;
        suggestions?: string[];
        value?: number;
        column_count?: number;
    };
}

export interface QuickAction {
    id: string;
    title: string;
    description: string;
    query: string;
}

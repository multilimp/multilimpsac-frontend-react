
import apiClient from "./apiClient";

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export class BaseApiService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async getAll(): Promise<ApiResponse<T[]>> {
    try {
      const response = await apiClient.get<ApiResponse<T[]>>(this.endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: string | number): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: string | number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected handleError(error: any): Error {
    if (error.response && error.response.data && error.response.data.message) {
      return new Error(error.response.data.message);
    }
    return new Error("Ocurrió un error al procesar la solicitud");
  }
}

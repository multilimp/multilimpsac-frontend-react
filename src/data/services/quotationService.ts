
import { BaseApiService } from "@/core/api/baseService";
import { Quotation } from "@/data/models/quotation";

class QuotationService extends BaseApiService<Quotation> {
  constructor() {
    super("/quotations");
  }

  async approve(id: string): Promise<any> {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/approve`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async reject(id: string, reason: string): Promise<any> {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async send(id: string, email: string): Promise<any> {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/send`, { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async convertToSale(id: string): Promise<any> {
    try {
      const response = await this.apiClient.post(`${this.endpoint}/${id}/convert-to-sale`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  get apiClient() {
    return this._apiClient;
  }
  
  private _apiClient = {
    post: async (url: string, data?: any) => {
      // This is a mock implementation
      console.log(`POST request to ${url}`, data);
      return { 
        data: { 
          success: true, 
          message: "Operation successful", 
          data: {} 
        } 
      };
    }
  };
}

export const quotationService = new QuotationService();

import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PdfPropertiesService {
  private apiUrl = environment.apiUrl;

  async checkProperties(domain: string, limit: number, startDate: any, endDate: any): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/check-pdf-properties`, { domain, limit, startDate, endDate });
    return response.data;
  }

  async uploadFiles(formData: FormData): Promise<any> {
    const response = await axios.post(`${this.apiUrl}/upload-pdf-properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PdfPropertiesService {
  async checkProperties(domain: string, limit: number): Promise<any> {
    const response = await axios.post('http://localhost:3000/api/check-pdf-properties', { domain, limit });
    return response.data;
  }

  async uploadFiles(formData: FormData): Promise<any> {
    const response = await axios.post('http://localhost:3000/api/upload-pdf-properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

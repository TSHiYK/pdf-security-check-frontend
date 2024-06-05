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
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  getLogs(): Observable<{ timestamp: string, level: string, message: string }> {
    return new Observable(observer => {
      this.socket.on('log', (data: { level: string, message: string }) => {
        const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        observer.next({ timestamp, ...data });
      });
    });
  }
}

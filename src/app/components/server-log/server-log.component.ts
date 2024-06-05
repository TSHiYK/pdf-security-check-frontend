import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server-log',
  templateUrl: './server-log.component.html',
  styleUrls: ['./server-log.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ServerLogComponent implements OnInit {
  logs: { timestamp: string, level: string, message: string }[] = [];

  ngOnInit() {
    this.connectToServerLogs();
  }

  connectToServerLogs() {
    const socket = io('http://localhost:3000');
    socket.on('log', (data: { level: string, message: string }) => {
      const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
      this.logs.unshift({ timestamp, ...data });
      console.log(`[${data.level}] ${data.message}`);
    });
  }
}

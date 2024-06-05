import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  createChart(elementId: string, label: string, count: number, total: number) {
    setTimeout(() => {
      const canvas = document.getElementById(elementId) as HTMLCanvasElement;
      if (!canvas) {
        console.error(`Failed to create chart: can't acquire context from the given item with id ${elementId}`);
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        console.error(`Failed to create chart: can't acquire context from the given item with id ${elementId}`);
        return;
      }

      new Chart(context, {
        type: 'pie',
        data: {
          labels: [`${label}`, 'Not ' + label],
          datasets: [{
            data: [count, total - count],
            backgroundColor: [count > 0 ? 'black' : 'gray', 'lightgray'],
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: `${label}`
            }
          }
        },
      });
    }, 0);
  }
}

import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-accessibility-summary',
  templateUrl: './accessibility-summary.component.html',
  styleUrls: ['./accessibility-summary.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AccessibilitySummaryComponent implements OnChanges {
  @Input() pdfDocuments: any[] = [];
  documentCount = 0;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfDocuments']) {
      this.documentCount = this.pdfDocuments.length;
      this.cdr.detectChanges();
      this.createCharts();
    }
  }

  createCharts() {
    const documentCount = this.pdfDocuments.length;
    if (documentCount === 0) {
      return;
    }

    const taggedCount = this.pdfDocuments.filter(doc => doc.pdfProperties.document.is_tagged).length;
    const textCount = this.pdfDocuments.filter(doc => doc.pdfProperties.pages.some((page: any) => page.content.has_text)).length;
    const imagesCount = this.pdfDocuments.filter(doc => doc.pdfProperties.pages.some((page: any) => page.content.has_images)).length;
    const formFieldsCount = this.pdfDocuments.filter(doc => doc.pdfProperties.document.has_acroform).length;
    const outlineCount = this.pdfDocuments.filter(doc => doc.pdfProperties.document.has_structure).length;
    const scannedPagesCount = this.pdfDocuments.filter(doc => doc.pdfProperties.pages.some((page: any) => page.is_scanned)).length;
    const pdfUaCount = this.pdfDocuments.filter(doc => doc.pdfProperties.document.pdfua_compliance_level).length;
    const linearizedCount = this.pdfDocuments.filter(doc => doc.pdfProperties.document.is_linearized).length;

    this.createChart('taggedChart', 'タグ付き', taggedCount, documentCount);
    this.createChart('textChart', 'テキストの有無', textCount, documentCount);
    this.createChart('imagesChart', '画像の有無', imagesCount, documentCount);
    this.createChart('formFieldsChart', 'フォームフィールド', formFieldsCount, documentCount);
    this.createChart('outlineChart', '構造化', outlineCount, documentCount);
    this.createChart('scannedPagesChart', 'スキャンされたページ', scannedPagesCount, documentCount);
    this.createChart('pdfUaChart', 'PDF/UA準拠', pdfUaCount, documentCount);
    this.createChart('linearizedChart', 'Web表示用に最適化', linearizedCount, documentCount);
  }

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
        plugins: [ChartDataLabels],
        data: {
          labels: [`${label}`, `${label}なし`],
          datasets: [{
            data: [count, total - count],
            backgroundColor: [count > 0 ? 'black' : 'gray', 'lightgray'],
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            datalabels: {
              display: (context) => {
                // "なし"のラベルのデータラベルを非表示にする
                return context.dataIndex === 0;
              },
              formatter: (value, context) => {
                let percentage = (value / total * 100).toFixed(0);
                return percentage + '%';
              },
              anchor: 'start',
              align: 'center',
              offset: 0,
              color: '#fff',
              font: {
                weight: 'bold',
                size: 32
              }
            }
          }
        },
      });
    }, 0);
  }
}

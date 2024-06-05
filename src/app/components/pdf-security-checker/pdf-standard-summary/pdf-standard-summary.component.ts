import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pdf-standard-summary',
  templateUrl: './pdf-standard-summary.component.html',
  styleUrls: ['./pdf-standard-summary.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PdfStandardSummaryComponent implements OnChanges {
  @Input() pdfDocuments: any[] = [];
  documentCount = 0;

  standards = [
    {
      key: 'pdfa_compliance_level',
      title: 'PDF/A',
      description: 'PDF/Aは、長期保存を目的としたアーカイブ用の標準規格です。電子文書が将来にわたって閲覧可能であることを保証します。'
    },
    {
      key: 'pdfua_compliance_level',
      title: 'PDF/UA',
      description: 'PDF/UAは、障害を持つユーザーがPDF文書にアクセスできるようにするための標準規格です。スクリーンリーダーなどの支援技術に対応しています。'
    },
    {
      key: 'pdfvt_compliance_level',
      title: 'PDF/VT',
      description: 'PDF/VTは、大量のパーソナライズド印刷を目的とした標準規格です。バリアブルデータ印刷に対応し、高品質な印刷結果を保証します。'
    },
    {
      key: 'pdfx_compliance_level',
      title: 'PDF/X',
      description: 'PDF/Xは、印刷業界向けの標準規格です。カラーやフォントなどの印刷品質を保証し、印刷プロセスでの問題を防ぎます。'
    },
    {
      key: 'pdfe_compliance_level',
      title: 'PDF/E',
      description: 'PDF/Eは、エンジニアリング文書に特化した標準規格です。CAD図面やその他の技術文書の交換に適しています。'
    }
  ];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfDocuments']) {
      this.documentCount = this.pdfDocuments.length;
      this.cdr.detectChanges();
      this.createChart();
    }
  }

  createChart() {
    const documentCount = this.pdfDocuments.length;
    if (documentCount === 0) {
      return;
    }

    const pdfACompliance = this.pdfDocuments.filter(doc => doc.pdfProperties.document.pdfa_compliance_level).length;
    const pdfUACompliance = this.pdfDocuments.filter(doc => doc.pdfProperties.document.pdfua_compliance_level).length;
    const pdfVTCompliance = this.pdfDocuments.filter(doc => doc.pdfProperties.document.pdfvt_compliance_level).length;
    const pdfXCompliance = this.pdfDocuments.filter(doc => doc.pdfProperties.document.pdfx_compliance_level).length;
    const pdfECompliance = this.pdfDocuments.filter(doc => doc.pdfProperties.document.pdfe_compliance_level).length;

    const chartData = {
      labels: this.standards.map(standard => standard.title),
      datasets: [{
        data: [pdfACompliance, pdfUACompliance, pdfVTCompliance, pdfXCompliance, pdfECompliance],
        backgroundColor: ['black', 'black', 'black', 'black', 'black'],
        hoverBackgroundColor: ['#c9c9c9', '#c9c9c9', '#c9c9c9', '#c9c9c9', '#c9c9c9']
      }]
    };

    const canvas = document.getElementById('standardChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Failed to create chart: can't acquire context from the given item with id standardChart`);
      return;
    }

    const context = canvas.getContext('2d');
    if (context) {
      new Chart(context, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.raw} PDFs`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: documentCount,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                  return null;
                }
              }
            },
            x: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              }
            }
          }
        }
      });
    } else {
      console.error(`Failed to create chart: can't acquire context from the given item with id standardChart`);
    }
  }
}

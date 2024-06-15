import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-security-summary',
  templateUrl: './security-summary.component.html',
  styleUrls: ['./security-summary.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SecuritySummaryComponent implements OnChanges {
  @Input() pdfDocuments: any[] = [];
  documentCount = 0;
  versionCounts: { [version: string]: number } = {};
  versionAlgorithmCounts: { [version: string]: { [algorithm: string]: { [bitLength: number]: number } } } = {};

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pdfDocuments']) {
      this.documentCount = this.pdfDocuments.length;
      this.cdr.detectChanges();
      this.createCharts();
      this.calculateVersionCounts();
      this.calculateVersionAlgorithmCounts();
    }
  }

  createCharts() {
    const documentCount = this.pdfDocuments.length;
    if (documentCount === 0) {
      return;
    }
    // Basic Security Items
    const encryptedCount = this.pdfDocuments.filter(doc => doc.pdfProperties.document.is_encrypted).length;
    const signedCount = this.pdfDocuments.filter(doc => doc.pdfProperties.document.is_signed).length;
    const certifiedCount = this.pdfDocuments.filter(doc => doc.pdfProperties.document.is_certified).length;

    this.createPieChart('encryptedChart', 'Encryption', encryptedCount, documentCount);
    this.createPieChart('signedChart', 'Signed', signedCount, documentCount);
    this.createPieChart('certifiedChart', 'Certified', certifiedCount, documentCount);

    // Document Restrictions Summary
    const printingCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.printing !== 'none').length;
    const copyingCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.copying).length;
    const modifyingCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.editing).length;
    const annotationCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.commenting).length;
    const formFillingCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.form_filling).length;
    const accessibilityCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.assistive_technology).length;
    const extractionCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.page_extraction).length;
    const assemblyCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.document_assembly).length;
    // const templateCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.permissions?.templateCount).length;

    this.createBarChart(
      'documentRestrictionsChart',
      [
        '印刷許可',
        '内容のコピー許可',
        'ページの抽出許可',
        '文書の変更許可',
        '注釈許可',
        'フォームフィールドの入力許可',
        'アクセシビリティのため内容の抽出許可',
        '文書アセンブリ許可',
        // 'テンプレートページの作成許可'
      ],
      [
        printingCount,
        copyingCount,
        extractionCount,
        modifyingCount,
        annotationCount,
        formFillingCount,
        accessibilityCount,
        assemblyCount,
        // templateCount
      ],
      documentCount
    );

    // Additional Security Items
    const ownerPasswordCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.encryption?.has_owner_password).length;
    const userPasswordCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.encryption?.has_user_password).length;
    const metadataEncryptionCount = this.pdfDocuments.filter(doc => doc.pdfProperties.security_info?.encryption?.encrypt_metadata).length;

    this.createBarChart(
      'additionalSecurityChart',
      ['ユーザーパスワード', 'オーナーパスワード', 'メタデータの暗号化'],
      [userPasswordCount, ownerPasswordCount, metadataEncryptionCount],
      documentCount
    );
  }

  createPieChart(elementId: string, label: string, count: number, total: number) {
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
                return context.dataIndex === 0;
              },
              formatter: (value, context) => {
                let percentage = (value / total * 100).toFixed(0);
                return percentage + '%';
              },
              color: '#fff',
              font: {
                weight: 'bold',
                size: 48
              },
              anchor: 'start',
              align: 'center',
              offset: 0,
            }
          }
        },
      });
    }, 0);
  }

  createBarChart(elementId: string, labels: string[], data: number[], total: number) {
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
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'ファイル数',
            data: data,
            backgroundColor: 'black',
            borderWidth: 0,
          }]
        },
        options: {
          responsive: true,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              formatter: (value, context) => {
                return value > 0 ? `${value}` : '';
              },
              color: '#000',
              font: {
                weight: 'bold',
                size: 16
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: total, // 横軸の最大値を取得ドキュメント数に設定
              ticks: {
                stepSize: 1,
                precision: 0, // 整数のみ表示
              }
            }
          },
          layout: {
            padding: {
              left: 20,
              right: 20,
              top: 20,
              bottom: 20
            }
          }
        },
      });
    }, 0);
  }

  calculateVersionCounts() {
    this.versionCounts = this.pdfDocuments.reduce((acc, doc) => {
      const version = doc.pdfProperties.document.pdf_version;
      acc[version] = (acc[version] || 0) + 1;
      return acc;
    }, {} as { [version: string]: number });
  }

  calculateVersionAlgorithmCounts() {
    this.versionAlgorithmCounts = this.pdfDocuments.reduce((acc, doc) => {
      const version = doc.pdfProperties.document.pdf_version;
      const isEncrypted = doc.pdfProperties.document.is_encrypted;
      const algorithm = isEncrypted ? doc.pdfProperties.security_info?.encryption?.algorithm || '暗号化なし' : '暗号化なし';
      const bitLength = isEncrypted ? (doc.pdfProperties.security_info?.encryption?.bit_length?.toString() || '') : '';

      if (!acc[version]) {
        acc[version] = {};
      }
      if (!acc[version][algorithm]) {
        acc[version][algorithm] = {};
      }
      acc[version][algorithm][bitLength] = (acc[version][algorithm][bitLength] || 0) + 1;
      return acc;
    }, {} as { [version: string]: { [algorithm: string]: { [bitLength: string]: number } } });
  }

  calculateRowspan(version: { [algorithm: string]: { [bitLength: string]: number } }): number {
    let count = 0;
    for (let algo of Object.values(version)) {
      count += Object.keys(algo).length;
    }
    return count;
  }
}

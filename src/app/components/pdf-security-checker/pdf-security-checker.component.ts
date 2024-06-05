import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { PdfPropertiesService } from '../../services/pdf-properties.service';
import { PdfDocument } from '../../models/pdf-document.model';
import { SecuritySummaryComponent } from './security-summary/security-summary.component';
import { AccessibilitySummaryComponent } from './accessibility-summary/accessibility-summary.component';
import { PdfStandardSummaryComponent } from './pdf-standard-summary/pdf-standard-summary.component';
import { DateFormatService } from '../../services/date-format.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-pdf-security-checker',
  templateUrl: './pdf-security-checker.component.html',
  styleUrls: ['./pdf-security-checker.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatExpansionModule,
    SecuritySummaryComponent,
    AccessibilitySummaryComponent,
    PdfStandardSummaryComponent
  ],
  providers: [PdfPropertiesService]
})
export class PdfSecurityCheckerComponent implements OnInit {
  domain = '';
  limit = 1;
  pdfDocuments: PdfDocument[] = [];
  loading = false;
  errorMessage = '';
  documentCount = 0;

  constructor(private pdfPropertiesService: PdfPropertiesService, private dateFormatService: DateFormatService, private cdr: ChangeDetectorRef) { }

  ngOnInit() { }

  async checkProperties() {
    this.loading = true;
    this.errorMessage = '';
    this.pdfDocuments = [];

    try {
      const response = await this.pdfPropertiesService.checkProperties(this.domain, this.limit);
      this.pdfDocuments = response.map((item: any) => {
        const pdfProperties = JSON.parse(item.pdfProperties);
        return {
          ...item,
          pdfProperties: {
            ...pdfProperties,
            document: {
              ...pdfProperties.document,
              info_dict: {
                ...pdfProperties.document.info_dict,
                CreationDate: this.dateFormatService.formatDateToJapanTime(pdfProperties.document.info_dict.CreationDate ?? ''),
                ModDate: this.dateFormatService.formatDateToJapanTime(pdfProperties.document.info_dict.ModDate ?? '')
              }
            }
          }
        };
      });
      this.documentCount = this.pdfDocuments.length;
      this.cdr.detectChanges(); // Detect changes before creating charts
    } catch (error) {
      this.errorMessage = 'An error occurred while checking the PDF properties.';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  downloadCSV() {
    const data = this.pdfDocuments.map(doc => ({
      URL: doc.pdfUrl,
      Filename: doc.fileName,
      'File Size': doc.pdfProperties.document.file_size,
      'PDF Version': doc.pdfProperties.document.pdf_version,
      'Page Count': doc.pdfProperties.document.page_count,
      Title: doc.pdfProperties.document.info_dict.Title ?? '',
      Author: doc.pdfProperties.document.info_dict.Author ?? '',
      'Creation Date': doc.pdfProperties.document.info_dict.CreationDate ?? '',
      'Modification Date': doc.pdfProperties.document.info_dict.ModDate ?? '',
      'Application': doc.pdfProperties.document.info_dict.Creator ?? '',
      'Tagged': doc.pdfProperties.document.is_tagged,
      'Has Acroform': doc.pdfProperties.document.has_acroform,
      'Has Embedded Files': doc.pdfProperties.document.has_embedded_files,
      'Incremental Save Count': doc.pdfProperties.document.incremental_save_count,
      'Certified': doc.pdfProperties.document.is_certified,
      'Signed': doc.pdfProperties.document.is_signed,
      'Encryption': doc.pdfProperties.document.is_encrypted,
      'Linearized': doc.pdfProperties.document.is_linearized,
      'Portfolio': doc.pdfProperties.document.is_portfolio,
      'Is FTPDF': doc.pdfProperties.document.is_FTPDF,
      'PDF/A Compliance Level': doc.pdfProperties.document.pdfa_compliance_level ?? '',
      'PDF/E Compliance Level': doc.pdfProperties.document.pdfe_compliance_level ?? '',
      'PDF/UA Compliance Level': doc.pdfProperties.document.pdfua_compliance_level ?? '',
      'PDF/VT Compliance Level': doc.pdfProperties.document.pdfvt_compliance_level ?? '',
      'PDF/X Compliance Level': doc.pdfProperties.document.pdfx_compliance_level ?? '',
      'Encryption Attachments Only': doc.pdfProperties.security_info.encryption?.encrypt_attachments_only,
      'Has Owner Password': doc.pdfProperties.security_info.encryption?.has_owner_password,
      'Encrypt Metadata': doc.pdfProperties.security_info.encryption?.encrypt_metadata,
      'Has User Password': doc.pdfProperties.security_info.encryption?.has_user_password,
      'Encryption Bit Length': doc.pdfProperties.security_info.encryption?.bit_length,
      'Encryption Algorithm': doc.pdfProperties.security_info.encryption?.algorithm,
      'Assistive Technology': doc.pdfProperties.security_info.permissions?.assistive_technology,
      'Form Filling': doc.pdfProperties.security_info.permissions?.form_filling,
      'Copying': doc.pdfProperties.security_info.permissions?.copying,
      'Page Extraction': doc.pdfProperties.security_info.permissions?.page_extraction,
      'Document Assembly': doc.pdfProperties.security_info.permissions?.document_assembly,
      'Commenting': doc.pdfProperties.security_info.permissions?.commenting,
      'Printing': doc.pdfProperties.security_info.permissions?.printing,
      'Editing': doc.pdfProperties.security_info.permissions?.editing,
      'Number of Images': doc.pdfProperties.pages.map(page => page.content.number_of_images).reduce((a, b) => a + b, 0),
      'Only Images': doc.pdfProperties.pages.some(page => page.content.only_images),
      'Has Text': doc.pdfProperties.pages.some(page => page.content.has_text),
      'Has Images': doc.pdfProperties.pages.some(page => page.content.has_images),
      'Is Empty': doc.pdfProperties.pages.some(page => page.content.is_empty),
      'Scanned Pages': doc.pdfProperties.pages.filter(page => page.is_scanned).length
    }));

    const options = {
      headers: [
        'URL',
        'Filename',
        'File Size',
        'PDF Version',
        'Page Count',
        'Title',
        'Author',
        'Creation Date',
        'Modification Date',
        'Application',
        'Tagged',
        'Has Acroform',
        'Has Embedded Files',
        'Incremental Save Count',
        'Certified',
        'Signed',
        'Encryption',
        'Linearized',
        'Portfolio',
        'Is FTPDF',
        'PDF/A Compliance Level',
        'PDF/E Compliance Level',
        'PDF/UA Compliance Level',
        'PDF/VT Compliance Level',
        'PDF/X Compliance Level',
        'Encryption Attachments Only',
        'Has Owner Password',
        'Encrypt Metadata',
        'Has User Password',
        'Encryption Bit Length',
        'Encryption Algorithm',
        'Assistive Technology',
        'Form Filling',
        'Copying',
        'Page Extraction',
        'Document Assembly',
        'Commenting',
        'Printing',
        'Editing',
        'Number of Images',
        'Only Images',
        'Has Text',
        'Has Images',
        'Is Empty',
        'Scanned Pages'
      ],
      useBom: true, // BOMを使用してエンコードをUTF-8にする
    };

    new ngxCsv(data, 'PDF_Documents_Report', options);
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfStandardSummaryComponent } from './pdf-standard-summary.component';

describe('PdfStandardSummaryComponent', () => {
  let component: PdfStandardSummaryComponent;
  let fixture: ComponentFixture<PdfStandardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfStandardSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfStandardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

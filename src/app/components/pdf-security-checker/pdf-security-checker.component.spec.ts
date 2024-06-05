import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfSecurityCheckerComponent } from './pdf-security-checker.component';

describe('PdfSecurityCheckerComponent', () => {
  let component: PdfSecurityCheckerComponent;
  let fixture: ComponentFixture<PdfSecurityCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfSecurityCheckerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfSecurityCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

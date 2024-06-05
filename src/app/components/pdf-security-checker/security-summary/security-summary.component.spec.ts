import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritySummaryComponent } from './security-summary.component';

describe('SecuritySummaryComponent', () => {
  let component: SecuritySummaryComponent;
  let fixture: ComponentFixture<SecuritySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritySummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecuritySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

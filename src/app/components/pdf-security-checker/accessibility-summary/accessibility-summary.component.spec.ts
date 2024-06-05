import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilitySummaryComponent } from './accessibility-summary.component';

describe('AccessibilitySummaryComponent', () => {
  let component: AccessibilitySummaryComponent;
  let fixture: ComponentFixture<AccessibilitySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessibilitySummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccessibilitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

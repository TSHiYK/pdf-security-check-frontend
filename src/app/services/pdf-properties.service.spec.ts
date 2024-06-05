import { TestBed } from '@angular/core/testing';

import { PdfPropertiesService } from './pdf-properties.service';

describe('PdfPropertiesService', () => {
  let service: PdfPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

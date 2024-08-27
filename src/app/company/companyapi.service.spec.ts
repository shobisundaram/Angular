import { TestBed } from '@angular/core/testing';

import { CompanyapiService } from './companyapi.service';

describe('CompanyapiserviceService', () => {
  let service: CompanyapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

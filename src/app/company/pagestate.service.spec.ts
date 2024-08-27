import { TestBed } from '@angular/core/testing';

import { PagestateService } from './pagestate.service';

describe('PagestateService', () => {
  let service: PagestateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagestateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

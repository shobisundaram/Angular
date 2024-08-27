import { TestBed } from '@angular/core/testing';
import { HeaderComponentsService } from './header-components.service';



describe('HeaderComponentsService', () => {
  let service: HeaderComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

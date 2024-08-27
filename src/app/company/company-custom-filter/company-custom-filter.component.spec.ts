import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCustomFilterComponent } from './company-custom-filter.component';

describe('CompanyCustomFilterComponent', () => {
  let component: CompanyCustomFilterComponent;
  let fixture: ComponentFixture<CompanyCustomFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCustomFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCustomFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

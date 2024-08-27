import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNgSelectComponent } from './company-ng-select.component';

describe('CompanyNgSelectComponent', () => {
  let component: CompanyNgSelectComponent;
  let fixture: ComponentFixture<CompanyNgSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyNgSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyNgSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

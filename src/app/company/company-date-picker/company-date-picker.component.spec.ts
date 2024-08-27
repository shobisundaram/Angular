import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDatePickerComponent } from './company-date-picker.component';

describe('CompanyDatePickerComponent', () => {
  let component: CompanyDatePickerComponent;
  let fixture: ComponentFixture<CompanyDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDatePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

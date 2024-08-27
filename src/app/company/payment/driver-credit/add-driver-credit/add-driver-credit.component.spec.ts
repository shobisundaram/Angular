import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverCreditComponent } from './add-driver-credit.component';

describe('AddDriverCreditComponent', () => {
  let component: AddDriverCreditComponent;
  let fixture: ComponentFixture<AddDriverCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDriverCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDriverCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

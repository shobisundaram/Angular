import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDriverCreditComponent } from './view-driver-credit.component';

describe('ViewDriverCreditComponent', () => {
  let component: ViewDriverCreditComponent;
  let fixture: ComponentFixture<ViewDriverCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDriverCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDriverCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

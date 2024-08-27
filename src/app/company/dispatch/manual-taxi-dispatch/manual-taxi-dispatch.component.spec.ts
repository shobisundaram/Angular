import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualTaxiDispatchComponent } from './manual-taxi-dispatch.component';

describe('ManualTaxiDispatchComponent', () => {
  let component: ManualTaxiDispatchComponent;
  let fixture: ComponentFixture<ManualTaxiDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualTaxiDispatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualTaxiDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

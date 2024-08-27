import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleExpiryComponent } from './vehicle-expiry.component';

describe('VehicleExpiryComponent', () => {
  let component: VehicleExpiryComponent;
  let fixture: ComponentFixture<VehicleExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleExpiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutstationVehicleComponent } from './add-outstation-vehicle.component';

describe('AddOutstationVehicleComponent', () => {
  let component: AddOutstationVehicleComponent;
  let fixture: ComponentFixture<AddOutstationVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutstationVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOutstationVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

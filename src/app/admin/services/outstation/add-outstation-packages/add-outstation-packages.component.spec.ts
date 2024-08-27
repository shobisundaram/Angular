import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutstationPackagesComponent } from './add-outstation-packages.component';

describe('AddOutstationPackagesComponent', () => {
  let component: AddOutstationPackagesComponent;
  let fixture: ComponentFixture<AddOutstationPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutstationPackagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOutstationPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

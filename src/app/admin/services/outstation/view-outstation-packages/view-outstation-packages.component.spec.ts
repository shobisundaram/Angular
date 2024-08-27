import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOutstationPackagesComponent } from './view-outstation-packages.component';

describe('ViewOutstationPackagesComponent', () => {
  let component: ViewOutstationPackagesComponent;
  let fixture: ComponentFixture<ViewOutstationPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOutstationPackagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOutstationPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

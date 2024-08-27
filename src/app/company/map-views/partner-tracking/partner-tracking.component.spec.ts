import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerTrackingComponent } from './partner-tracking.component';

describe('PartnerTrackingComponent', () => {
  let component: PartnerTrackingComponent;
  let fixture: ComponentFixture<PartnerTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

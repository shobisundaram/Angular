import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerAttendenceComponent } from './partner-attendence.component';

describe('PartnerAttendenceComponent', () => {
  let component: PartnerAttendenceComponent;
  let fixture: ComponentFixture<PartnerAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerAttendenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

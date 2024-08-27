import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerExpiryComponent } from './partner-expiry.component';

describe('PartnerExpiryComponent', () => {
  let component: PartnerExpiryComponent;
  let fixture: ComponentFixture<PartnerExpiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerExpiryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

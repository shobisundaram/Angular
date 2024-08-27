import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerSettlementComponent } from './partner-settlement.component';

describe('PartnerSettlementComponent', () => {
  let component: PartnerSettlementComponent;
  let fixture: ComponentFixture<PartnerSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionStatusChangeComponent } from './subscription-status-change.component';

describe('SubscriptionStatusChangeComponent', () => {
  let component: SubscriptionStatusChangeComponent;
  let fixture: ComponentFixture<SubscriptionStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionStatusChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

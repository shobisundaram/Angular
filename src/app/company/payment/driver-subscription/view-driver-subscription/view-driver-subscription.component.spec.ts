import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDriverSubscriptionComponent } from './view-driver-subscription.component';

describe('ViewDriverSubscriptionComponent', () => {
  let component: ViewDriverSubscriptionComponent;
  let fixture: ComponentFixture<ViewDriverSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDriverSubscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDriverSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

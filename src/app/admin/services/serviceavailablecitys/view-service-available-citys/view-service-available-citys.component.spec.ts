import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServiceAvailableCitysComponent } from './view-service-available-citys.component';

describe('ViewServiceAvailableCitysComponent', () => {
  let component: ViewServiceAvailableCitysComponent;
  let fixture: ComponentFixture<ViewServiceAvailableCitysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewServiceAvailableCitysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewServiceAvailableCitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

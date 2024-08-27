import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceAvailableCitysComponent } from './add-service-available-citys.component';

describe('AddServiceAvailableCitysComponent', () => {
  let component: AddServiceAvailableCitysComponent;
  let fixture: ComponentFixture<AddServiceAvailableCitysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServiceAvailableCitysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServiceAvailableCitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

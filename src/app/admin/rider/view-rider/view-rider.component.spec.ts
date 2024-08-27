import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRiderComponent } from './view-rider.component';

describe('ViewRiderComponent', () => {
  let component: ViewRiderComponent;
  let fixture: ComponentFixture<ViewRiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

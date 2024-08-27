import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTripsComponent } from './ongoing-trips.component';

describe('OngoingTripsComponent', () => {
  let component: OngoingTripsComponent;
  let fixture: ComponentFixture<OngoingTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingTripsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngoingTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

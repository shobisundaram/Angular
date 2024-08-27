import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingTripsComponent } from './upcoming-trips.component';

describe('UpcomingTripsComponent', () => {
  let component: UpcomingTripsComponent;
  let fixture: ComponentFixture<UpcomingTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingTripsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

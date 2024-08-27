import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResponseTripsComponent } from './no-response-trips.component';

describe('NoResponseTripsComponent', () => {
  let component: NoResponseTripsComponent;
  let fixture: ComponentFixture<NoResponseTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoResponseTripsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoResponseTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarChartRiderComponent } from './solar-chart-rider.component';

describe('SolarChartRiderComponent', () => {
  let component: SolarChartRiderComponent;
  let fixture: ComponentFixture<SolarChartRiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarChartRiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarChartRiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

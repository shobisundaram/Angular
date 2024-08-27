import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarChartDriverComponent } from './solar-chart-driver.component';

describe('SolarChartDriverComponent', () => {
  let component: SolarChartDriverComponent;
  let fixture: ComponentFixture<SolarChartDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarChartDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarChartDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

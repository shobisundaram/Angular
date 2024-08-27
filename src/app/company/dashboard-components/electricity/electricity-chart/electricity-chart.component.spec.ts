import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityChartComponent } from './electricity-chart.component';

describe('ElectricityChartComponent', () => {
  let component: ElectricityChartComponent;
  let fixture: ComponentFixture<ElectricityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricityChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

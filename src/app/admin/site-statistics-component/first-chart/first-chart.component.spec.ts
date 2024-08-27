import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstChartComponent } from './first-chart.component';

describe('FirstChartComponent', () => {
  let component: FirstChartComponent;
  let fixture: ComponentFixture<FirstChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

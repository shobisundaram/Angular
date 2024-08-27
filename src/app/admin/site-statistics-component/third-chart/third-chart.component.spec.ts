import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdChartComponent } from './third-chart.component';

describe('ThirdChartComponent', () => {
  let component: ThirdChartComponent;
  let fixture: ComponentFixture<ThirdChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThirdChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCityComponent } from './view-city.component';

describe('ViewCityComponent', () => {
  let component: ViewCityComponent;
  let fixture: ComponentFixture<ViewCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

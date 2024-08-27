import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPriceingComponent } from './view-priceing.component';

describe('ViewPriceingComponent', () => {
  let component: ViewPriceingComponent;
  let fixture: ComponentFixture<ViewPriceingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPriceingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPriceingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

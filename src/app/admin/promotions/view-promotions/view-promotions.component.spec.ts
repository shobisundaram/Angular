import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPromotionsComponent } from './view-promotions.component';

describe('ViewPromotionsComponent', () => {
  let component: ViewPromotionsComponent;
  let fixture: ComponentFixture<ViewPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPromotionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

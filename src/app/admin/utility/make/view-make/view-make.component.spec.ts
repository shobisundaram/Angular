import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMakeComponent } from './view-make.component';

describe('ViewMakeComponent', () => {
  let component: ViewMakeComponent;
  let fixture: ComponentFixture<ViewMakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMakeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

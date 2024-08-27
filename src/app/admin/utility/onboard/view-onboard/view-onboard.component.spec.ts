import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnboardComponent } from './view-onboard.component';

describe('ViewOnboardComponent', () => {
  let component: ViewOnboardComponent;
  let fixture: ComponentFixture<ViewOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOnboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

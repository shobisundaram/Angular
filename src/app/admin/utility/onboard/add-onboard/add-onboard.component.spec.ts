import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnboardComponent } from './add-onboard.component';

describe('AddOnboardComponent', () => {
  let component: AddOnboardComponent;
  let fixture: ComponentFixture<AddOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOnboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

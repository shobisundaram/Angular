import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrivertaxiComponent } from './add-drivertaxi.component';

describe('AddDrivertaxiComponent', () => {
  let component: AddDrivertaxiComponent;
  let fixture: ComponentFixture<AddDrivertaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDrivertaxiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDrivertaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

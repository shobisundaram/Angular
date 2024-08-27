import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiderComponent } from './add-rider.component';

describe('AddRiderComponent', () => {
  let component: AddRiderComponent;
  let fixture: ComponentFixture<AddRiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRiderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

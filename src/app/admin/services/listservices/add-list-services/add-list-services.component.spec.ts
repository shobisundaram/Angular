import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListServicesComponent } from './add-list-services.component';

describe('AddListServicesComponent', () => {
  let component: AddListServicesComponent;
  let fixture: ComponentFixture<AddListServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddListServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddListServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdminGroupComponent } from './add-admin-group.component';

describe('AddAdminGroupComponent', () => {
  let component: AddAdminGroupComponent;
  let fixture: ComponentFixture<AddAdminGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAdminGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAdminGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

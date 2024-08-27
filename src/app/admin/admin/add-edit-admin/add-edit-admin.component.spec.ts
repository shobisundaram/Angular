import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAdminComponent } from './add-edit-admin.component';

describe('AddEditAdminComponent', () => {
  let component: AddEditAdminComponent;
  let fixture: ComponentFixture<AddEditAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

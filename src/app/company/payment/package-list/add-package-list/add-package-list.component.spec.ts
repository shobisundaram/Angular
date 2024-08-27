import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPackageListComponent } from './add-package-list.component';

describe('AddPackageListComponent', () => {
  let component: AddPackageListComponent;
  let fixture: ComponentFixture<AddPackageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPackageListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPackageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

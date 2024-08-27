import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAdminGroupComponent } from './view-admin-group.component';

describe('ViewAdminGroupComponent', () => {
  let component: ViewAdminGroupComponent;
  let fixture: ComponentFixture<ViewAdminGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAdminGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAdminGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowratedUsersComponent } from './lowrated-users.component';

describe('LowratedUsersComponent', () => {
  let component: LowratedUsersComponent;
  let fixture: ComponentFixture<LowratedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LowratedUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowratedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListServicesComponent } from './view-list-services.component';

describe('ViewListServicesComponent', () => {
  let component: ViewListServicesComponent;
  let fixture: ComponentFixture<ViewListServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewListServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewListServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

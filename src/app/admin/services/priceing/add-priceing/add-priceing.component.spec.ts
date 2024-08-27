import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPriceingComponent } from './add-priceing.component';

describe('AddPriceingComponent', () => {
  let component: AddPriceingComponent;
  let fixture: ComponentFixture<AddPriceingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPriceingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPriceingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

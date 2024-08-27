import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTranslationComponent } from './view-translation.component';

describe('ViewTranslationComponent', () => {
  let component: ViewTranslationComponent;
  let fixture: ComponentFixture<ViewTranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTranslationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

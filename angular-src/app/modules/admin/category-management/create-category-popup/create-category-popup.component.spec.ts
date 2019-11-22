import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryPopupComponent } from './create-category-popup.component';

describe('CreateCategoryPopupComponent', () => {
  let component: CreateCategoryPopupComponent;
  let fixture: ComponentFixture<CreateCategoryPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCategoryPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

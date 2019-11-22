import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCategoryComponent } from './change-category.component';

describe('ChangeCategoryComponent', () => {
  let component: ChangeCategoryComponent;
  let fixture: ComponentFixture<ChangeCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

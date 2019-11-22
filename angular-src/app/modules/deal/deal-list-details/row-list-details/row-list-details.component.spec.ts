import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowListDetailsComponent } from './row-list-details.component';

describe('RowListDetailsComponent', () => {
  let component: RowListDetailsComponent;
  let fixture: ComponentFixture<RowListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowListDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealListDetailsComponent } from './deal-list-details.component';

describe('DealListDetailsComponent', () => {
  let component: DealListDetailsComponent;
  let fixture: ComponentFixture<DealListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealListDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

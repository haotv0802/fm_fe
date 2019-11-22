import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorSummaryComponent } from './competitor-summary.component';

describe('CompetitorSummaryComponent', () => {
  let component: CompetitorSummaryComponent;
  let fixture: ComponentFixture<CompetitorSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitorSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

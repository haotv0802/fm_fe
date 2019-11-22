import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorSummaryChartComponentComponent } from './competitor-summary-chart-component.component';

describe('CompetitorSummaryChartComponentComponent', () => {
  let component: CompetitorSummaryChartComponentComponent;
  let fixture: ComponentFixture<CompetitorSummaryChartComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitorSummaryChartComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorSummaryChartComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAdjustmentComponent } from './report-adjustment.component';

describe('ReportAdjustmentComponent', () => {
  let component: ReportAdjustmentComponent;
  let fixture: ComponentFixture<ReportAdjustmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAdjustmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

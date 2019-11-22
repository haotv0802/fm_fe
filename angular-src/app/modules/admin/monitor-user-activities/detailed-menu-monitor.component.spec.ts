import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {DetailedMenuMonitorComponent} from "./detailed-menu-monitor.component";

describe('DetailedMenuMonitorComponent', () => {
  let component: DetailedMenuMonitorComponent;
  let fixture: ComponentFixture<DetailedMenuMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedMenuMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedMenuMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

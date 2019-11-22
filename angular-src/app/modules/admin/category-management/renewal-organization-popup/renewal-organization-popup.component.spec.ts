import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalOrganizationPopupComponent } from './renewal-organization-popup.component';

describe('RenewalOrganizationPopupComponent', () => {
  let component: RenewalOrganizationPopupComponent;
  let fixture: ComponentFixture<RenewalOrganizationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalOrganizationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalOrganizationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

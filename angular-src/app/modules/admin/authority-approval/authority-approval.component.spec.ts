import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityApprovalComponent } from './authority-approval.component';

describe('AuthorityApprovalComponent', () => {
  let component: AuthorityApprovalComponent;
  let fixture: ComponentFixture<AuthorityApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorityApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

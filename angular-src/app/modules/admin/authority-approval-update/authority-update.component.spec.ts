import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityUpdateComponent } from './authority-update.component';

describe('AuthorityApprovalComponent', () => {
  let component: AuthorityUpdateComponent;
  let fixture: ComponentFixture<AuthorityUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorityUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorityUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

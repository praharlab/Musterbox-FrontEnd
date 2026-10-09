import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditOrgAuthorizationComponent } from './edit-org-authorization.component';

describe('EditOrgAuthorizationComponent', () => {
  let component: EditOrgAuthorizationComponent;
  let fixture: ComponentFixture<EditOrgAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrgAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrgAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

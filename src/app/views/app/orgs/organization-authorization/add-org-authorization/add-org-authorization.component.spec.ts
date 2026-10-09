import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOrgAuthorizationComponent } from './add-org-authorization.component';

describe('AddOrgAuthorizationComponent', () => {
  let component: AddOrgAuthorizationComponent;
  let fixture: ComponentFixture<AddOrgAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrgAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrgAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

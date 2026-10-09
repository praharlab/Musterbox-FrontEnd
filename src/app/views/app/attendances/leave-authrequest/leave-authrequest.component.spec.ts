import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaveAuthrequestComponent } from './leave-authrequest.component';

describe('LeaveAuthrequestComponent', () => {
  let component: LeaveAuthrequestComponent;
  let fixture: ComponentFixture<LeaveAuthrequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveAuthrequestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAuthrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

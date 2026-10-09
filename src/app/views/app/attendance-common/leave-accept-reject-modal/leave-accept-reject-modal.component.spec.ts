import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaveAcceptRejectModalComponent } from './leave-accept-reject-modal.component';

describe('LeaveAcceptRejectModalComponent', () => {
  let component: LeaveAcceptRejectModalComponent;
  let fixture: ComponentFixture<LeaveAcceptRejectModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveAcceptRejectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveAcceptRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

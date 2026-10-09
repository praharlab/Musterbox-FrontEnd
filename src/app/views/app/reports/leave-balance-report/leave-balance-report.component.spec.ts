import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaveBalanceReportComponent } from './leave-balance-report.component';

describe('LeaveBalanceReportComponent', () => {
  let component: LeaveBalanceReportComponent;
  let fixture: ComponentFixture<LeaveBalanceReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveBalanceReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

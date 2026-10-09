import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaveBalanceSummaryReportComponent } from './leave-balance-summary-report.component';

describe('LeaveBalanceSummaryReportComponent', () => {
  let component: LeaveBalanceSummaryReportComponent;
  let fixture: ComponentFixture<LeaveBalanceSummaryReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveBalanceSummaryReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveBalanceSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

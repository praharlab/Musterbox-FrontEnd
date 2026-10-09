import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaveUpdateReportComponent } from './leave-update-report.component';

describe('LeaveUpdateReportComponent', () => {
  let component: LeaveUpdateReportComponent;
  let fixture: ComponentFixture<LeaveUpdateReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveUpdateReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveUpdateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

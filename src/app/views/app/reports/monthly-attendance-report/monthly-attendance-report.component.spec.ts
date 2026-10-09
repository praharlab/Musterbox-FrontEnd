import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonthlyAttendanceReportComponent } from './monthly-attendance-report.component';

describe('MonthlyAttendanceReportComponent', () => {
  let component: MonthlyAttendanceReportComponent;
  let fixture: ComponentFixture<MonthlyAttendanceReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendanceTimingReportComponent } from './attendance-timing-report.component';

describe('AttendanceTimingReportComponent', () => {
  let component: AttendanceTimingReportComponent;
  let fixture: ComponentFixture<AttendanceTimingReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceTimingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceTimingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

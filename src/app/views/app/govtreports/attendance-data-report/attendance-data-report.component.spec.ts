import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendanceDataReportComponent } from './attendance-data-report.component';

describe('AttendanceDataReportComponent', () => {
  let component: AttendanceDataReportComponent;
  let fixture: ComponentFixture<AttendanceDataReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceDataReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceDataReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SlotWiseAttendanceReportComponent } from './slot-wise-attendance-report.component';

describe('SlotWiseAttendanceReportComponent', () => {
  let component: SlotWiseAttendanceReportComponent;
  let fixture: ComponentFixture<SlotWiseAttendanceReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlotWiseAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotWiseAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

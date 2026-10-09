import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttendanceCorrectionReportComponent } from './attendance-correction-report.component';

describe('AttendanceCorrectionReportComponent', () => {
  let component: AttendanceCorrectionReportComponent;
  let fixture: ComponentFixture<AttendanceCorrectionReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceCorrectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceCorrectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

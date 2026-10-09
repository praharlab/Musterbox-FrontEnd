import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaleAttendanceReportComponent } from './tale-attendance-report.component';

describe('TaleAttendanceReportComponent', () => {
  let component: TaleAttendanceReportComponent;
  let fixture: ComponentFixture<TaleAttendanceReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TaleAttendanceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaleAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

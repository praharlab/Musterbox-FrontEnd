import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeAttendanceCalendarComponent } from './employee-attendance-calendar.component';

describe('EmployeeAttendanceCalendarComponent', () => {
  let component: EmployeeAttendanceCalendarComponent;
  let fixture: ComponentFixture<EmployeeAttendanceCalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeAttendanceCalendarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

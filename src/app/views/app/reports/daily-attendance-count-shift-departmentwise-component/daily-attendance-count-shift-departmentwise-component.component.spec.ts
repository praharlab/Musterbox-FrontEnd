import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyAttendanceCountShiftDepartmentwiseComponentComponent } from './daily-attendance-count-shift-departmentwise-component.component';

describe('DailyAttendanceCountShiftDepartmentwiseComponentComponent', () => {
  let component: DailyAttendanceCountShiftDepartmentwiseComponentComponent;
  let fixture: ComponentFixture<DailyAttendanceCountShiftDepartmentwiseComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAttendanceCountShiftDepartmentwiseComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAttendanceCountShiftDepartmentwiseComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

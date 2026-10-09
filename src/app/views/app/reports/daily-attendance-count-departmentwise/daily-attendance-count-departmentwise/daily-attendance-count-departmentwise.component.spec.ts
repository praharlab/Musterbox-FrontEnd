import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyAttendanceCountDepartmentwiseComponent } from './daily-attendance-count-departmentwise.component';

describe('DailyAttendanceCountDepartmentwiseComponent', () => {
  let component: DailyAttendanceCountDepartmentwiseComponent;
  let fixture: ComponentFixture<DailyAttendanceCountDepartmentwiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAttendanceCountDepartmentwiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAttendanceCountDepartmentwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

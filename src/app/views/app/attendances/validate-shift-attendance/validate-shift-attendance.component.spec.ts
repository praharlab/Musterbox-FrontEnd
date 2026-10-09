import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValidateShiftAttendanceComponent } from './validate-shift-attendance.component';

describe('ValidateShiftAttendanceComponent', () => {
  let component: ValidateShiftAttendanceComponent;
  let fixture: ComponentFixture<ValidateShiftAttendanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ValidateShiftAttendanceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateShiftAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

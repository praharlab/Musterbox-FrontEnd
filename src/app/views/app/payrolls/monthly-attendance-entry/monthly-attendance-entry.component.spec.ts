import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonthlyAttendanceEntryComponent } from './monthly-attendance-entry.component';

describe('MonthlyAttendanceEntryComponent', () => {
  let component: MonthlyAttendanceEntryComponent;
  let fixture: ComponentFixture<MonthlyAttendanceEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyAttendanceEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyAttendanceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

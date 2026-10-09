import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeAttendanceListComponent } from './employee-attendance-list.component';

describe('EmployeeAttendanceListComponent', () => {
  let component: EmployeeAttendanceListComponent;
  let fixture: ComponentFixture<EmployeeAttendanceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeAttendanceListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

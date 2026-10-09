import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleEmployeeAttendanceListComponent } from './single-employee-attendance-list.component';

describe('SingleEmployeeAttendanceListComponent', () => {
  let component: SingleEmployeeAttendanceListComponent;
  let fixture: ComponentFixture<SingleEmployeeAttendanceListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SingleEmployeeAttendanceListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleEmployeeAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

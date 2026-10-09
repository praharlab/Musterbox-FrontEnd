import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeAttendancePolicyComponent } from './employee-attendance-policy.component';

describe('EmployeeAttendancePolicyComponent', () => {
  let component: EmployeeAttendancePolicyComponent;
  let fixture: ComponentFixture<EmployeeAttendancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAttendancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

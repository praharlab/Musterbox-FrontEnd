import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeAttendanceBonusPolicyComponent } from './employee-attendance-bonus-policy.component';

describe('EmployeeAttendanceBonusPolicyComponent', () => {
  let component: EmployeeAttendanceBonusPolicyComponent;
  let fixture: ComponentFixture<EmployeeAttendanceBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAttendanceBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAttendanceBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

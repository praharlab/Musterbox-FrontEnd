import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewEmployeeAttendancePolicyComponent } from './view-employee-attendance-policy.component';

describe('ViewEmployeeAttendancePolicyComponent', () => {
  let component: ViewEmployeeAttendancePolicyComponent;
  let fixture: ComponentFixture<ViewEmployeeAttendancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeAttendancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeAttendancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

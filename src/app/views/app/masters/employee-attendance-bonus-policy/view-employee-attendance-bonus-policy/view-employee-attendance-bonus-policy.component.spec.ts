import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewEmployeeAttendanceBonusPolicyComponent } from './view-employee-attendance-bonus-policy.component';

describe('ViewEmployeeAttendanceBonusPolicyComponent', () => {
  let component: ViewEmployeeAttendanceBonusPolicyComponent;
  let fixture: ComponentFixture<ViewEmployeeAttendanceBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployeeAttendanceBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeAttendanceBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

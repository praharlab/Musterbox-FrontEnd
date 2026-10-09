import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeAttendancePolicyComponent } from './list-employee-attendance-policy.component';

describe('ListEmployeeAttendancePolicyComponent', () => {
  let component: ListEmployeeAttendancePolicyComponent;
  let fixture: ComponentFixture<ListEmployeeAttendancePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployeeAttendancePolicyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeAttendancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

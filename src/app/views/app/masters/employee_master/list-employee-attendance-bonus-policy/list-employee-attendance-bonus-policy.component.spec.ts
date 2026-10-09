import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListEmployeeAttendanceBonusPolicyComponent } from './list-employee-attendance-bonus-policy.component';

describe('ListEmployeeAttendanceBonusPolicyComponent', () => {
  let component: ListEmployeeAttendanceBonusPolicyComponent;
  let fixture: ComponentFixture<ListEmployeeAttendanceBonusPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmployeeAttendanceBonusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmployeeAttendanceBonusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

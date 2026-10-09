import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeHolidayPolicyComponent } from './employee-holiday-policy.component';

describe('EmployeeHolidayPolicyComponent', () => {
  let component: EmployeeHolidayPolicyComponent;
  let fixture: ComponentFixture<EmployeeHolidayPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeHolidayPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeHolidayPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

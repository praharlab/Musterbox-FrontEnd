import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViweEmployeeHolidayPolicyComponent } from './viwe-employee-holiday-policy.component';

describe('ViweEmployeeHolidayPolicyComponent', () => {
  let component: ViweEmployeeHolidayPolicyComponent;
  let fixture: ComponentFixture<ViweEmployeeHolidayPolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViweEmployeeHolidayPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViweEmployeeHolidayPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeMonthWiseSalaryReportComponent } from './employee-month-wise-salary-report.component';

describe('EmployeeMonthWiseSalaryReportComponent', () => {
  let component: EmployeeMonthWiseSalaryReportComponent;
  let fixture: ComponentFixture<EmployeeMonthWiseSalaryReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMonthWiseSalaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMonthWiseSalaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

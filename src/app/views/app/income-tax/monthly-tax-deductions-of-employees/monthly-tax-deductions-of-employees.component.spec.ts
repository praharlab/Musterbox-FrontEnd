import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonthlyTaxDeductionsOfEmployeesComponent } from './monthly-tax-deductions-of-employees.component';

describe('MonthlyTaxDeductionsOfEmployeesComponent', () => {
  let component: MonthlyTaxDeductionsOfEmployeesComponent;
  let fixture: ComponentFixture<MonthlyTaxDeductionsOfEmployeesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyTaxDeductionsOfEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyTaxDeductionsOfEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

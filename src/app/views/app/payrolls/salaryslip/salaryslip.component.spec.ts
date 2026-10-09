import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalaryslipComponent } from './salaryslip.component';

describe('SalaryslipComponent', () => {
  let component: SalaryslipComponent;
  let fixture: ComponentFixture<SalaryslipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryslipComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryslipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

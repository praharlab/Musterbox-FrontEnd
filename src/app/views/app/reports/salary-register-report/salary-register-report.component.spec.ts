import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalaryRegisterReportComponent } from './salary-register-report.component';

describe('SalaryRegisterReportComponent', () => {
  let component: SalaryRegisterReportComponent;
  let fixture: ComponentFixture<SalaryRegisterReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryRegisterReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryRegisterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

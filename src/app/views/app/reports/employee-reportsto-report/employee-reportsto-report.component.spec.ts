import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeReportstoReportComponent } from './employee-reportsto-report.component';

describe('EmployeeReportstoReportComponent', () => {
  let component: EmployeeReportstoReportComponent;
  let fixture: ComponentFixture<EmployeeReportstoReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeReportstoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeReportstoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

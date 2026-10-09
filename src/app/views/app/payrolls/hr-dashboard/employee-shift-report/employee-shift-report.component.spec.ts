import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeShiftReportComponent } from './employee-shift-report.component';

describe('EmployeeShiftReportComponent', () => {
  let component: EmployeeShiftReportComponent;
  let fixture: ComponentFixture<EmployeeShiftReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeShiftReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeShiftReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

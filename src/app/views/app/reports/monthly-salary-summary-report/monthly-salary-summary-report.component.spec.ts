import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonthlySalarySummaryReportComponent } from './monthly-salary-summary-report.component';

describe('MonthlySalarySummaryReportComponent', () => {
  let component: MonthlySalarySummaryReportComponent;
  let fixture: ComponentFixture<MonthlySalarySummaryReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlySalarySummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySalarySummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

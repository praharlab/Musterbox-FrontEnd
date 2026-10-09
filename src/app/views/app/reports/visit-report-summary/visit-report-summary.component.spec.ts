import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VisitReportSummaryComponent } from './visit-report-summary.component';

describe('VisitReportSummaryComponent', () => {
  let component: VisitReportSummaryComponent;
  let fixture: ComponentFixture<VisitReportSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VisitReportSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitReportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
